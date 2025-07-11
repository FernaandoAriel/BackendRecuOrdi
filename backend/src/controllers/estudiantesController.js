const estudiantesController = {};
import estudiantesModel from "../models/estudiantes.js"

estudiantesController.getEstudiantes = async (req, res) => {
    try {
        const estudiantes = await estudiantesModel.find();
        res.json(estudiantes);
    } catch (error) {
        console.error('Error getting estudiantes:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
}

estudiantesController.createEstudiantes = async (req, res) => {
    try {
        const {carnet, nombre, apellido, grado, estado} = req.body;
        
        // Validación básica
        if (!carnet || !nombre || !apellido || !grado) {
            return res.status(400).json({ 
                message: "Todos los campos son obligatorios" 
            });
        }

        // Verificar si el carnet ya existe
        const existingStudent = await estudiantesModel.findOne({ carnet });
        if (existingStudent) {
            return res.status(400).json({ 
                message: "Ya existe un estudiante con ese carnet" 
            });
        }

        const newEstudiante = new estudiantesModel({
            carnet, 
            nombre, 
            apellido, 
            grado, 
            estado: estado || 'Activo'
        });
        
        await newEstudiante.save();
        res.status(201).json({ 
            message: "Estudiante creado exitosamente",
            estudiante: newEstudiante
        });
    } catch (error) {
        console.error('Error creating estudiante:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
}

estudiantesController.deleteEstudiantes = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEstudiante = await estudiantesModel.findByIdAndDelete(id);
        
        if (!deletedEstudiante) {
            return res.status(404).json({ 
                message: "Estudiante no encontrado" 
            });
        }
        
        res.json({ 
            message: "Estudiante eliminado exitosamente",
            estudiante: deletedEstudiante
        });
    } catch (error) {
        console.error('Error deleting estudiante:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
}

estudiantesController.updateEstudiantes = async (req, res) => {
    try {
        const { id } = req.params;
        const { carnet, nombre, apellido, grado, estado } = req.body;
        
        // Validación básica
        if (!carnet || !nombre || !apellido || !grado) {
            return res.status(400).json({ 
                message: "Todos los campos son obligatorios" 
            });
        }

        // Verificar si el carnet ya existe en otro estudiante
        const existingStudent = await estudiantesModel.findOne({ 
            carnet, 
            _id: { $ne: id } 
        });
        if (existingStudent) {
            return res.status(400).json({ 
                message: "Ya existe otro estudiante con ese carnet" 
            });
        }

        const updatedEstudiante = await estudiantesModel.findByIdAndUpdate(
            id, 
            { carnet, nombre, apellido, grado, estado },
            { new: true, runValidators: true }
        );
        
        if (!updatedEstudiante) {
            return res.status(404).json({ 
                message: "Estudiante no encontrado" 
            });
        }
        
        res.json({ 
            message: "Estudiante actualizado exitosamente",
            estudiante: updatedEstudiante
        });
    } catch (error) {
        console.error('Error updating estudiante:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
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