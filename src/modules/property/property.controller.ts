import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { propertiesService } from "./property.service";

// create landlordProperties
const createProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const payload = req.body;

    const result = await propertiesService.createPropertiesIntoDB(
      landlordId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property Posted successfully!",
      data: result,
    });
  },
);

// get all properties with filter
const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await propertiesService.getAllPropertiesFromDB(req.query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Properties Retrieve successfully!",
      data: data.data,
      meta: data.meta,
    });
  },
);

// get property by id
const getPropertiesById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id;

    const property = await propertiesService.getPropertiesByIdFromDB(
      propertyId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties Retrieve successfully!",
      data: { property },
    });
  },
);

const updatePropertyById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const propertyId = req.params.id;
    const userId = req.user?.id;

    const result = await propertiesService.updatePropertiesByIdIntoDB(
      propertyId as string,
      userId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Properties Updated successfully!",
      data: result,
    });
  },
);

export const propertiesController = {
  createProperties,
  getAllProperties,
  getPropertiesById,
  updatePropertyById,
};
