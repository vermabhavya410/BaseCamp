import { ProjectMember } from "../models/projectMember.modal.js";

// Create Membership
export const createProjectMemberRepo = (data) => {
  return ProjectMember.create(data);
};

// Get Memberships of User
export const getUserMembershipsRepo = (userId) => {
  return ProjectMember.find({ userId });
};

// Get Membership of Specific User in Project
export const getUserProjectMembershipRepo = (userId, projectId) => {
  return ProjectMember.findOne({ userId, projectId });
};

// Count Members in Project
export const countProjectMembersRepo = (projectId) => {
  return ProjectMember.countDocuments({ projectId });
};