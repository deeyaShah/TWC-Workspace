import express from 'express';
const router=express.Router();
import userController from '../Controller/userController.js';

router.get("/", userController.getAllUsers);
router.get("/deleted", userController.getDeletedUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.put("/soft-delete/:id", userController.softDeleteUser);
router.put("/restore/:id", userController.restoreUser);
router.delete("/permanent-delete/:id", userController.deleteUser);

export default router;