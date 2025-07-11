const estudiantesController = {};
import estudiantesModel from "../models/estudiantes.js"

estudiantesController.getEstudiantes = async (req, res) => {
    const estudiante = await estudiantesModel.find();
    res.json(estudiante);
}

estudiantesController.createEstudiantes = async (req, res) => {
    const {firstName, lastName, birthDate, dui, password, email, phone} = req.body;
    const newEstudiante = new estudiantesModel({
        firstName,
        lastName,
        birthDate,
        dui,
        password,
        email,
        phone
    });
    await newEstudiante.save();
    res.json({ message: "Estudiante creado" });
}

estudiantesController.deleteEstudiantes = async (req, res) => {
    const deleteEstudiante = await estudiantesModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Estudiante eliminado" });
}

estudiantesController.updateEstudiantes = async (req, res) => {
    const { firstName, lastName, birthDate, dui, password, email, phone} = req.body;
    await estudiantesModel.findByIdAndUpdate(req.params.id, {
        firstName,
        lastName,
        birthDate,
        dui,
        password,
        email,
        phone
    });
    res.json({ message: "Estudiantes actualizado" });
}

estudiantesController.getEstudiantesById = async (req, res) => {
    try {
        const { id } = req.params;

        const estudiante = await estudiantesModel.findById(id);

        if (!estudiante) {
            return res.status(404).json({
                message: 'Estudiante no encontrado'
            });
        }

        res.status(200).json(estudiante);

    } catch (error) {
        console.error('Error getting estudiante by ID:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
};

export default estudiantesController;