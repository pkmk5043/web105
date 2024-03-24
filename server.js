const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const app = express();


// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/config', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 300000000000000000000000000, // 30 seconds, adjust as needed
  socketTimeoutMS: 4500000000, // 45 seconds, adjust as needed
})
.then(() => {
  console.log('Connected to config DB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });
  
  mongoose.connection.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
  });

// Define a collection name (optional)
const collectionName = 'vehicles';

// Access the collection without a schema
const collection = mongoose.connection.collection(collectionName);

// Route to fetch data
app.get('/api/data', async (req, res) => {
  try {
    const data = await collection.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// Route to save data
app.post('/api/data', async (req, res) => {
  try {
    const obj = req.body;
    //check if the vehicle is available
    await collection.find({numberOfWheels : obj.numberOfWheels, selectedVehicleType : obj.selectedVehicleType, selectedVehicleModel : obj.selectedVehicleModel}).toArray((err, vehicle) => {
        if (err) {
          console.error('Error finding documents:', err);
          return;
        }
        if(vehicle[0].booked){
            if(vehicle[0].bookedfrom == obj.startDate){
                res.status(200).send({"success":true,message:"Requested vehicle is not available"});
            } else if(vehicle[0].endDate < obj.startDate){
                //allow to book;
                obj.booked =true;
                collection.updateOne({numberOfWheels : obj.numberOfWheels, selectedVehicleType : obj.selectedVehicleType, selectedVehicleModel : obj.selectedVehicleModel}, obj, (err, updatedVehicle) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({error: "unsuccessful"})
                    };
                    res.send({success: "success","message": `${updatedVehicle.name} is booked for you`});
                });
            }
            
        }else{
            //allow to book
            obj.booked = true;
            collection.updateOne({numberOfWheels : obj.numberOfWheels, selectedVehicleType : obj.selectedVehicleType, selectedVehicleModel : obj.selectedVehicleModel}, obj, (err, updatedVehicle) => {
                if (err) {
                    return res
                        .status(500)
                        .send({error: "unsuccessful"})
                };
                res.send({success: "success","message": `${updatedVehicle.name} is booked for you`});
            });
        }
      });
   
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Error booking vehicle' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});