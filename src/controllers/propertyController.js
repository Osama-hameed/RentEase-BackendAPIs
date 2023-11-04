import propertyModel from "../models/propertyModel.js";
import userModel from "../models/userModel.js";


//create-ideas
export const createPropertyController = async (req, res) => {
    try {
      const {
        propertyLocation,
        propertySize,
        propertyRent,
        propertyDescription,
        user,
      } = req.body;
  
      //validation
      switch (true) {
        case !propertyDescription:
          return res.status(500).send({ error: "description is Required" });
        case !propertySize:
          return res.status(500).send({ error: "size is Required" });
          case !propertyRent:
            return res.status(500).send({ error: "rent is Required" });
            case !propertyLocation:
                return res.status(500).send({ error: "location is Required" });
            case !user:
          return res.status(500).send({ error: "User is Required" });
      }
  
      const property = new propertyModel({propertyDescription,propertyLocation,propertyRent,propertySize,user});
     
  
      await property.save();
      res.status(201).send({
        success: true,
        message: "property Created Successfully",
        property,
      });
      console.log(property);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in creating property",
      });
    }
  };


//get all properties
export const getPropertyController = async (req, res) => {
    try {
      const property = await propertyModel
        .find({})
        .populate("user", "-password")
        .sort({ createdAt: 1 });
      res.status(200).send({
        success: true,
        countTotal: property.length,
        message: "All properties ",
        property,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Erorr in getting property",
        error: error.message,
      });
    }
  };

//get property by propertyId
export const getPropertyByPropertyIdController = async (req, res) => {
    try {
        const { propertyId } = req.body;

      const property = await propertyModel.findOne({_id:propertyId}).populate("user", "-password");
      res.status(200).send({
        success: true,
        countTotal: property.length,
        message: "Property by id found.",
        property,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Erorr in getting property",
        error: error.message,
      });
    }
  };


  export const updatePropertyController = async (req, res) => {
    try {
        const {
            propertyId,
            propertyLocation,
            propertySize,
            propertyRent,
            propertyDescription
          } = req.body;
          console.log(propertyId,propertyDescription)
          await propertyModel.findByIdAndUpdate(propertyId, { propertyLocation: propertyLocation, propertySize:propertySize, propertyRent:propertyRent, propertyDescription:propertyDescription});
          res.status(200).json({
            success:true,
            message:"Property has been updated."});
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in updating property.",
        error,
      });
    }
  };