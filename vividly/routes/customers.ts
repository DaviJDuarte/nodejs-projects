import {Request, Response, Router} from "express";
import {
    Customer,
    CustomerModel,
    customerCreateValidator,
    customerSchema,
    customerUpdateValidator
} from "../models/customer";
import mongoose, {HydratedDocument} from "mongoose";
import {ValidationError} from "joi";

const router: Router = Router();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const customers: Customer[] = await CustomerModel.find();
        return res.json(customers);
    } catch (error) {
        return res.status(500).json(error);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({message: "The provided ID is invalid!"});
    }

    try {
        const customer: Customer | null = await CustomerModel.findById(req.params.id);

        if (!customer) return res.status(404).json({message: `No resource found with id: ${req.params.id}`});

        return res.json(customer);
    } catch (ex) {
        return res.status(500).json(ex);
    }
});

router.post('/', async (req: Request, res: Response) => {
    const {error}: { error: ValidationError | undefined } = customerCreateValidator(req.body);

    if (error) return res.status(400).json({message: error.message});

    const customer: HydratedDocument<Customer> = new CustomerModel({
        isGold: req.body.isGold || false,
        name: req.body.name,
        phone: req.body.phone
    });

    try {
        const result: Customer = await customer.save();
        return res.json({new_customer: result});
    } catch (ex) {
        return res.status(500).json(ex);
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    const {id} = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({message: "The provided ID is invalid!"});
    }

    const {error}: { error: ValidationError | undefined } = customerUpdateValidator(req.body);
    if (error) return res.status(400).json({message: error.message});

    const updates = req.body;

    const filteredUpdates = Object.keys(updates).reduce((acc: Record<string, any>, field: string) => {
        acc.$set = acc.$set || {};

        if (customerSchema.paths[field]) {
            acc.$set[field] = updates[field];
        }
        return acc;
    }, {});

    try {
        const result: Customer | null = await CustomerModel.findByIdAndUpdate(id, filteredUpdates, {
            new: true
        });

        if (!result) {
            return res.status(400).json({message: 'Customer not found'});
        }

        return res.json({updated_customer: result});
    } catch (ex) {
        return res.status(500).json(ex);
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({message: "The provided ID is invalid!"});
    }

    try {
        const customer: Customer | null = await CustomerModel.findByIdAndDelete(req.params.id);

        if (!customer) return res.status(404).json({message: `No resource found with id: ${req.params.id}`});

        return res.json({deleted: customer});
    } catch (ex) {
        return res.status(500).json(ex);
    }
});

export default router;