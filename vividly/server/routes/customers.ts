import {Request, Response, Router} from "express";
import {
    CustomerModel,
    customerCreateValidator,
    customerSchema,
    customerUpdateValidator
} from "../models/customer";
import mongoose, {HydratedDocument} from "mongoose";
import {models} from "../types";
import ICustomer = models.ICustomer;
import validateObjectId from "../middleware/validateObjectId";
import asyncWrapper from "../middleware/asyncWrapper";
import validateRequestBody from "../middleware/validateRequestBody";
import auth from "../middleware/auth";
import admin from "../middleware/admin";

const router: Router = Router();

router.get('/', asyncWrapper(async (_req: Request, res: Response) => {
    const customers: ICustomer[] = await CustomerModel.find();
    return res.json(customers);
}));

router.get('/:id', validateObjectId, asyncWrapper(async (req: Request, res: Response) => {
    const customer: ICustomer | null = await CustomerModel.findById(req.params.id);

    if (!customer) return res.status(404).json({message: `No resource found with id: ${req.params.id}`});

    return res.json(customer);
}));

router.post('/', [auth, validateRequestBody(customerCreateValidator)], asyncWrapper(async (req: Request, res: Response) => {
    const customer: HydratedDocument<ICustomer> = new CustomerModel({
        isGold: req.body.isGold || false,
        name: req.body.name,
        phone: req.body.phone
    });

    const result: ICustomer = await customer.save();
    return res.json({new_customer: result});
}));

router.put('/:id', [auth, validateObjectId, validateRequestBody(customerUpdateValidator)], asyncWrapper(async (req: Request, res: Response) => {
    const {id} = req.params;

    const updates = req.body;

    const filteredUpdates = Object.keys(updates).reduce((acc: Record<string, any>, field: string) => {
        acc.$set = acc.$set || {};

        if (customerSchema.paths[field]) {
            acc.$set[field] = updates[field];
        }
        return acc;
    }, {});

    const result: ICustomer | null = await CustomerModel.findByIdAndUpdate(id, filteredUpdates, {
        new: true
    });

    if (!result) {
        return res.status(400).json({message: 'Customer not found'});
    }

    return res.json({updated_customer: result});
}));

router.delete('/:id', [auth, admin, validateObjectId], asyncWrapper(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({message: "The provided ID is invalid!"});
    }

    try {
        const customer: ICustomer | null = await CustomerModel.findByIdAndDelete(req.params.id);

        if (!customer) return res.status(404).json({message: `No resource found with id: ${req.params.id}`});

        return res.json({deleted: customer});
    } catch (ex) {
        return res.status(500).json(ex);
    }
}));

export default router;