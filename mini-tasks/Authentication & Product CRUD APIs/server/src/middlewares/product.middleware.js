import userModel from "../modules/user.model.js";

const checkAdmin = async (req, res, next) => {
    try{
        const id = req.user.id;

        const isAdmin = await userModel.findOne({ _id: id, role: "admin" });

        if (!isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        next();
    }catch(error){
        console.log("Error in checkAdmin middleware:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export { checkAdmin };