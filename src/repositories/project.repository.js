import { Project } from "../models/project.modal.js";

// Create Project
//data will come from the service layer and it will contain data like name of project , description etc
export const createProjectRepo = (data) => {
  return Project.create(data);
};

// Get Projects by IDs

//find:A Mongoose method to read multiple documents from MongoDB
export const getProjectsByIdsRepo = (projectIds) => {
  return Project.find({
    //WHAT is $in? MongoDB operator that means: Match any value from this list
    //Return all documents where _id matches any value inside the projectIds array.
    _id: { $in: projectIds },
    //only active projects will appear and not deleted ones
    isDeleted: false,
  });
};

// Get Single Project by ID
export const getProjectByIdRepo = (projectId) => {
  return Project.findOne({
    _id: projectId,
    isDeleted: false,
  });
};

// Update Project
export const updateProjectRepo = (projectId, updateData) => {
  return Project.findByIdAndUpdate(projectId, updateData, {
    new: true, // WHY: returns updated document
  });
};

// Soft Delete Project
export const softDeleteProjectRepo = (projectId) => {
  return Project.findByIdAndUpdate(
    projectId,
    {
      isDeleted: true,
      deletedAt: new Date(),
    },
    { new: true }
  );
};