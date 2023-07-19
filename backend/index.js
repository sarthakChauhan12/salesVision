const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcryptjs')

const app = express()
const PORT = process.env.PORT || 8000

app.use(bodyParser.json())
app.use(cors())

async function connectToMongoDB() {
  try {
    await mongoose.connect('mongodb://0.0.0.0:27017/dashboard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}

connectToMongoDB()

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
})

const dashboardSchema = new mongoose.Schema({
  totalSum: {
    type: Number,
    default: 0,
  },
  categorySales: {
    type: Map,
    of: Number,
    default: {},
  },
  regionSales: {
    type: Map,
    of: Number,
    default: {},
  },
})

dashboardSchema.methods.updateCategorySales = function (category, value) {
  if (!this.categorySales.has(category)) {
    this.categorySales.set(category, value)
  } else {
    this.categorySales.set(category, this.categorySales.get(category) + value)
  }
}

dashboardSchema.methods.updateRegionSales = function (region, value) {
  if (!this.regionSales.has(region)) {
    this.regionSales.set(region, value)
  } else {
    this.regionSales.set(region, this.regionSales.get(region) + value)
  }
}

const Dashboard = mongoose.model('Dashboard', dashboardSchema)

const User = mongoose.model('User', userSchema)

const clientDataCollection = mongoose.connection.collection('clientData')

app.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ message: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.json({ message: 'Internal server error' });
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.json({ message: 'Internal server error' });
  }
});


app.get('/getoptions', async (req, res) => {
  try {
    const cursor = clientDataCollection.find()
    const documents = await cursor.toArray()
    const options = documents
      .filter((doc) => doc.productName)
      .map((doc) => doc.productName)

    res.json(options)
  } catch (error) {
    console.error('Error fetching options:', error)
    res.status(500).json({ error: 'An error occurred' })
  }
})


app.post('/dashboard', async (req, res) => {
  var category = req.body.category
  var region = req.body.region
  var sales = req.body.sales

  var dashboard = await Dashboard.findOne()
  if (!dashboard) {
    dashboard = new Dashboard()
  }

  const totalSumFromMongo = dashboard.totalSum
  var totalSum = sales.reduce((acc, curr) => acc + curr, 0)

  dashboard.updateCategorySales(category, totalSum)
  dashboard.updateRegionSales(region, totalSum)

  totalSum = totalSum + totalSumFromMongo
  dashboard.totalSum = totalSum

  await dashboard.save()
  res.json(totalSum)
})

app.get('/getdashboarddata', async (req, res) => {
  try {
    var dashboard = await Dashboard.findOne()
    if (!dashboard) {
      dashboard = new Dashboard()
      res.json({ message: 'Dashboard has not been created yet' })
    }

    const { totalSum, categorySales, regionSales } = dashboard
    const categorySalesKeys = Array.from(categorySales.keys());
    const categorySalesValues = Array.from(categorySales.values());

    const regionSalesKeys = Array.from(regionSales.keys());
    const regionSalesValues = Array.from(regionSales.values());

    const response = {
      totalSum,
      categorySalesKeys,
      categorySalesValues,
      regionSalesKeys,
      regionSalesValues,
    };

    res.json(response)
  } catch (err) {
    console.log(`Error at getting dashboard data : ${err.message}`)
    res.json(err)
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
