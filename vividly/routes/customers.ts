import express from "express";
import mongoose from "mongoose";
import {Customer} from "../interfaces";
import {customerCreateValidator, customerUpdateValidator} from "../validators/body-validators";

const customerSchema = new mongoose.Schema({
    isGold: {type: Boolean, default: false},
    name: {type: String, required: true, min: 1, max: 100},
    phone: {type: String, required: true}
});

const CustomerModel = mongoose.model('Customer', customerSchema);

const router = express.Router();

router.get('/', async (_req, res) => {
    try {
        const customers = await CustomerModel.find();
        return res.send(JSON.stringify({customers}));
    } catch (error) {
        return res.status(500).send(JSON.stringify(error));
    }
});

router.get('/:id', async (req, res) => {
    try {
        const customer = await CustomerModel.findById(req.params.id);

        if (!customer) return res.status(404).send(JSON.stringify({message: `No resource found with id: ${req.params.id}`}));

        return res.send(JSON.stringify({customer}));
    } catch (ex: any) {
        if (ex.name === 'CastError' && ex.path === '_id') {
            return res.status(400).send(JSON.stringify({message: "The provided ID is invalid"}));
        }

        return res.status(500).send(JSON.stringify(ex));
    }
});

router.post('/', async (req, res) => {
    const {error} = customerCreateValidator(req.body);

    if (error) return res.status(400).send(JSON.stringify({message: error.message}));

    const customer = new CustomerModel({
        isGold: req.body.isGold || false,
        name: req.body.name,
        phone: req.body.phone
    });

    try {
        const result = await customer.save();
        return res.send(JSON.stringify({new_customer: result}));
    } catch (ex) {
        return res.status(500).send(JSON.stringify(ex));
    }
});

router.put('/:id', async (req, res) => {
    const {error} = customerUpdateValidator(req.body);

    if (error) return res.status(400).send(JSON.stringify({message: error.message}));

    try {
        const customer: Customer | null = await CustomerModel.findById(req.params.id);

        if (!customer) return res.status(404).send(JSON.stringify({message: `No resource found with id: ${req.params.id}`}));

        for (const key in req.body) {
            if (key in customer) {
                customer[key] = req.body[key];
            }
        }

        const result = await customer.save();
        return res.send(JSON.stringify({updated_customer: result}));

    } catch (ex: any) {
        if (ex.name === 'CastError' && ex.path === '_id') {
            return res.status(400).send(JSON.stringify({message: "The provided ID is invalid"}));
        }

        return res.status(500).send(JSON.stringify(ex));
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const customer = await CustomerModel.findByIdAndDelete(req.params.id);

        if (!customer) return res.status(404).send(JSON.stringify({message: `No resource found with id: ${req.params.id}`}));

        return res.send(JSON.stringify({deleted: customer}));
    } catch (ex: any) {
        if (ex.name === 'CastError' && ex.path === '_id') {
            return res.status(400).send(JSON.stringify({message: "The provided ID is invalid"}));
        }

        return res.status(500).send(JSON.stringify(ex));
    }
});

export default router;