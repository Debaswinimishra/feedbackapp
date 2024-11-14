import { dataAPI } from "../../api/api";

export const getAllocatedDistricts = async () => {
  return await dataAPI.post("/getAllDistricts");
};
export const getAllocatedBlocks = async () => {
  return await dataAPI.get(`/getAllBlocksByDistrict/PURI`);
};
