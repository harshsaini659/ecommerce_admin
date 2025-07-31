const Variant = require('../models/Variant')

exports.createVariant = async (req,res)=>{
    try{
        const {name, values} = req.body
        if(!name || !values || !Array.isArray(values) || values.length === 0){
            return res.status(400).send({
                success:false,
                message:"Variant name and values[] are required"
            })
        }
        
        // Check if variant with the same name already exists
        const existingVariant = await Variant.findOne({ name: name.trim()}) //trim() to remove any leading/trailing spaces
        if(existingVariant){
            return res.status(400).send({
                success:false,
                message:"Variant with this name already exists"
            })
        }

        // Create new variant
        const variant = new Variant({ name, values})
        await variant.save()
        res.status(201).send({
            success:true,
            message:"Variant created successfully",
            data:variant // when checking in postman this will show the created variant
        })
    }catch(err){
        console.error("Create Variant Error:", err.message)
        res.status(500).send("Internal Server Error")
    }
}

exports.listVariant = async (req,res)=>{
    try{
        const variants = await Variant.find().lean() // Fetch all variants and lean() converts to plain JavaScript objects
        if(!variants || variants.length === 0){
            return res.status(404).send({
                success: false,
                message: "No variants found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Variants fetched successfully",
            variants: variants
        })
    }catch(err){
        console.error("List Variants Error:", err.message)
        res.status(500).send("Internal Server Error")
    }
}