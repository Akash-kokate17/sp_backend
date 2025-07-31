const Service = require("../../models/services_model/services.model");

const uploadService = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      isActive,
      btn,
      sharpyCount,
      ledScreenCount,
    } = req.body;
    const fileName = req.file?.filename;

    const parsedPrice = parseInt(price);
    const parsedIsActive = isActive === "true";

    if (
      !title ||
      !description ||
      !parsedPrice ||
      !fileName ||
      typeof parsedIsActive !== "boolean" ||
      !btn
    ) {
      return res.status(400).send({ msg: "All fields are required" });
    }

    const newService = new Service({
      title,
      description,
      price: parsedPrice,
      isActive: parsedIsActive,
      serviceImgUpload: fileName,
      sharpyCount,
      ledScreenCount,
      btn,
    });

    await newService.save();

    res.status(201).send({
      msg: "Service added successfully",
      serviceAdded: true,
      data: newService,
    });
  } catch (error) {
    console.error("error to post service:", error);
    return res.status(500).send({ msg: "Error to post data of service" });
  }
};

const getAllServices = async (req, res) => {
  try {
    const allService = await Service.find({});
    if (allService.length === 0) {
      return res.status(404).send({ msg: "service not found" });
    }
    res
      .status(200)
      .send({ msg: "service fetch successfully", allService: allService });
  } catch (error) {
    console.log("error to get all service data");
    res.status(500).send({ msg: "error to get all service data" });
  }
};

const modifyService = async (req, res) => {
  try {
    const {
      _id,
      title,
      description,
      price,
      isActive,
      btn,
      sharpyCount,
      ledScreenCount,
    } = req.body;

    if (!_id) {
      return res.status(404).send({ msg: "Service ID not found" });
    }

    const updateData = {
      title,
      description,
      price,
      isActive,
      btn,
      sharpyCount,
      ledScreenCount,
    };

    // If a new file was uploaded, update the image path
    if (req.file) {
      updateData.serviceImgUpload = req.file.filename; // or full path if needed
    }

    const updatedService = await Service.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!updatedService) {
      return res.status(404).send({ msg: "Service not found" });
    }

    res.status(200).send({
      msg: "Service modified successfully",
      data: updatedService,
    });
  } catch (error) {
    console.error("Error modifying service:", error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

const deleteService = async (req, res) => {
  try {
    const _id = req.params._id;

    if (!_id) {
      return res.status(404).send({ msg: "service id is required" });
    }
    const result = await Service.findByIdAndDelete(_id);

    if (!result) {
      return res
        .status(404)
        .send({ msg: "Service not found or already deleted" });
    }

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .send({ msg: "user is not found or deleted already" });
    }

    res.status(200).send({ msg: "service is deleted successfully", result });
  } catch (error) {
    console.log("error to delete service", error);
    res.status(500).send({ msg: "error to delete service" });
  }
};

module.exports = {
  uploadService,
  getAllServices,
  modifyService,
  deleteService,
};
