from flask import Flask, request, render_template, jsonify
import os
import pickle
import pymongo
from datetime import datetime, timedelta
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from flask_cors import CORS
from flask_cors import cross_origin
from statsmodels.tsa.statespace.sarimax import SARIMAX
from prophet import Prophet



app = Flask(__name__, template_folder=os.path.abspath(os.path.dirname(__file__)))
CORS(app)


# MongoDB connection details
MONGO_URI = "mongodb://localhost:27017"  # Replace with your MongoDB URI
MONGO_DB = "dashboard"  # Replace with your database name
COLLECTION_NAME = "clientData"  # Replace with your collection name

# Create a MongoDB client
client = pymongo.MongoClient(MONGO_URI)
db = client[MONGO_DB]
collection = db[COLLECTION_NAME]

# Get the absolute path of the current file and the directory it's in
abs_path = os.path.abspath(__file__)
dir_path = os.path.dirname(abs_path)

# Build the path to the model file
model_path = os.path.join(dir_path, 'model_arima.pkl')

# Load the model from the file
with open(model_path, 'rb') as f:
    models = pickle.load(f)


def sarima_forecast(daily_sales):
    ts = pd.Series(daily_sales)
    # Train-test split
    train_data =daily_sales

    # Build and fit the SARIMA model
    model = SARIMAX(train_data, order=(1, 0, 0), seasonal_order=(1, 1, 1, 12))
    model_fit = model.fit()
    #
    # Forecast future sales for the next 365 days
    forecast = model_fit.forecast(steps=120)
    return forecast.tolist()

def prophet_forecast(daily_sales):
    # Create a dataframe from the input list
    input_list = daily_sales  # Replace with your input list of size 365
    df = pd.DataFrame({'ds': pd.date_range(start='2022-01-01', periods=365), 'y': input_list})

    # Initialize and fit the Prophet model
    model = Prophet()
    model.fit(df)

    # Create a dataframe with future dates for prediction
    future = model.make_future_dataframe(periods=120)

    # Generate forecasts for the future dates
    forecast = model.predict(future)

    # Extract the forecasted values for the next 120 elements
    forecasted_values = forecast['yhat'][-120:].values
    return forecasted_values


def generate_forecast(daily_sales):
    """
    Generates a 30-day sales forecast based on daily sales data.
    :param daily_sales: List of daily sales data.
    :return: List of sales forecast for the next 30 days.
    """
    today = datetime.today().date()

    # Calculate the start date one year ago
    one_year_ago = today - timedelta(days=364)

    # Create a dataframe
    df = pd.DataFrame(
        daily_sales,
        columns=['sales'],
        index=pd.date_range(start=one_year_ago, end=today, freq='D')
    )

    # Fit the model
    model = ExponentialSmoothing(df.sales, trend='add', seasonal='add', seasonal_periods=7).fit()

    # Forecast for the next 30 days
    forecast = model.forecast(120).astype(int).tolist()

    # Compare predicted values for the last 20 days with the actuals
    pred = model.predict(start=df.sales.index[-20], end=df.sales.index[-1]).astype(int).tolist()

    return forecast

def arima_prediction(daily_sales):
    model = ARIMA(daily_sales, order=(1, 1, 1))
    model_fit = model.fit()
    pred = model_fit.predict(start=366, end=365 + 120, dynamic=True)
    slope = (daily_sales[-1] - daily_sales[-30]) / 30
    pred = [i + slope * (j-1 )/3  for j, i in enumerate(pred)]
    import random
    rand_range = (max(pred) - min(pred)) // 2
    pred = [i + random.randint(-rand_range,rand_range) for i in pred]

    return list(pred)

# def arima_model_prediction(daily_sales):
#     model = ARIMA(daily_sales, order=(1, 1, 1))
#     model_fit = model.fit()
#     pred = model_fit.predict(start=366, end=365 + 120, dynamic=True)
#     slope = (daily_sales[-10] - daily_sales[-40]) / 7

#     pred = [i + slope * (j-1 )/3  for j, i in enumerate(pred)]

#     import random

#     rand_range = (max(pred) - min(pred)) // 12

#     pred = [i + random.randint(-rand_range,rand_range) for i in pred]

#     # Also, give it a curve

#     import math

#     pred = [i + 0.5 * i**0.01 * math.sin(i) for i in pred]

#     return list(pred)


@app.route('/')
@cross_origin()
def hello_world():
    """
    Renders the home page.
    """
    return render_template("my_file.html")


@app.route('/save', methods=['POST'])
@cross_origin()
def save_to_mongodb():
    """
    Saves data to MongoDB.
    """
    data = request.get_json()  # Assuming the request body is in JSON format

    # Save data to MongoDB
    collection.insert_one(data)

    return jsonify({"success": "Uploaded"})


@app.route('/prediction', methods=['POST'])
@cross_origin()
def process_array():
    """
    Processes an array of items and generates a sales forecast.
    """
    input_data = request.get_json()  # Retrieve the JSON data from the request body
    input_array = input_data['options']  # Assuming the array is passed in the 'array' field
    algorithm = input_data['algorithm']
    # return input_data

    

    output_array = [0] * 180

    for item in input_array:

        data = collection.find_one({'productName': item}, {'_id': 0})

        # return output_array
        # output_array  = [None] * 59 + [0] * 120
        if data:
            for i in range(60):
                output_array[i] += data['sales'][:365][305:][i]
            temp_array = [0] * 60
            # temp_array = []
            if(algorithm == "Arima"):
                temp_array.extend(arima_prediction(data['sales'][:365]))
            elif(algorithm == "Smoothing"):
                temp_array.extend(generate_forecast(data['sales'][:365]))
            elif(algorithm == "Sarima"):
                temp_array.extend(sarima_forecast(data['sales'][:365]))
            elif(algorithm == "Prophet"):
                temp_array.extend(prophet_forecast(data['sales'][:365]))
            for i in range(59,len(temp_array)):
                output_array[i] += temp_array[i]
        else:
            return jsonify({'error': 'No data found'})

    return jsonify(output_array)


if __name__ == '__main__':
    app.run(debug=True)
