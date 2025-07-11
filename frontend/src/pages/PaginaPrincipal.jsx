import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => { // Mantenemos el nombre Dashboard pero conceptualmente es PaginaPrincipal
    const navigate = useNavigate();
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        carnet: '',
        nombre: '',
        apellido: '',
        grado: '',
        estado: 'Activo'
    });

    // Estadísticas calculadas - Con validación segura
    const totalEstudiantes = estudiantes.length;
    const estudiantesActivos = estudiantes.filter(e => e.estado === 'Activo').length;
    const estudiantesInactivos = estudiantes.filter(e => e.estado === 'Inactivo').length;

    // Filtrar estudiantes - Con validación segura
    const filteredEstudiantes = estudiantes.filter(estudiante => {
        const searchLower = searchTerm.toLowerCase();
        const nombre = estudiante.nombre ? estudiante.nombre.toLowerCase() : '';
        const apellido = estudiante.apellido ? estudiante.apellido.toLowerCase() : '';
        const carnet = estudiante.carnet ? estudiante.carnet.toLowerCase() : '';
        
        return nombre.includes(searchLower) ||
               apellido.includes(searchLower) ||
               carnet.includes(searchLower);
    });

    useEffect(() => {
        fetchEstudiantes();
    }, []);

    const fetchEstudiantes = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/estudiantes');
            const data = await response.json();
            setEstudiantes(data);
        } catch (error) {
            console.error('Error fetching estudiantes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/estudiantes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchEstudiantes();
                resetForm();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error creating estudiante:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/estudiantes/${editingStudent._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchEstudiantes();
                resetForm();
                setShowModal(false);
                setEditingStudent(null);
            }
        } catch (error) {
            console.error('Error updating estudiante:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este estudiante?')) {
            try {
                const response = await fetch(`http://localhost:4000/api/estudiantes/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchEstudiantes();
                }
            } catch (error) {
                console.error('Error deleting estudiante:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            carnet: '',
            nombre: '',
            apellido: '',
            grado: '',
            estado: 'Activo'
        });
    };

    const openEditModal = (estudiante) => {
        setEditingStudent(estudiante);
        setFormData({
            carnet: estudiante.carnet || '',
            nombre: estudiante.nombre || '',
            apellido: estudiante.apellido || '',
            grado: estudiante.grado || '',
            estado: estudiante.estado || 'Activo'
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingStudent(null);
        resetForm();
        setShowModal(true);
    };

    const handleGoBack = () => {
        navigate('/bienvenida');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
                <div className="text-white text-xl">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 font-roboto">
            {/* Efectos de luz de fondo */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-green-400 flex items-center justify-center">
                                <div className="w-8 h-8 bg-white/20"></div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Escuelita Marvel</h1>
                                <p className="text-purple-200 text-sm">Dashboard Administrativo</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-white font-medium">Administrador</p>
                                <p className="text-purple-200 text-sm">Sistema Escuelita Marvel</p>
                            </div>
                            <button
                                onClick={handleGoBack}
                                className="bg-purple-600/80 hover:bg-purple-700 text-white px-4 py-2 transition-colors duration-200"
                            >
                                Volver al Inicio
                            </button>
                        </div>
                    </div>
                </header>

                {/* Estadísticas */}
                <div className="max-w-7xl mx-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-200 text-sm">Total Estudiantes</p>
                                    <p className="text-3xl font-bold text-white">{totalEstudiantes}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-500/30 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-purple-400"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-200 text-sm">Estudiantes Activos</p>
                                    <p className="text-3xl font-bold text-white">{estudiantesActivos}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-500/30 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-green-400"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-200 text-sm">Estudiantes Inactivos</p>
                                    <p className="text-3xl font-bold text-white">{estudiantesInactivos}</p>
                                </div>
                                <div className="w-12 h-12 bg-gray-500/30 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-gray-400"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controles */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <h2 className="text-2xl font-bold text-white">Gestión de Estudiantes</h2>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    placeholder="Buscar estudiantes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-4 py-2 bg-white/10 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:border-green-400"
                                />
                                <button
                                    onClick={openCreateModal}
                                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-2 font-medium transform transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                    Nuevo Estudiante
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de estudiantes */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Carnet</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Nombre</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Apellido</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Grado</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Estado</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEstudiantes.map((estudiante, index) => (
                                        <tr key={estudiante._id || index} className="border-t border-white/10 hover:bg-white/5 transition-colors duration-200">
                                            <td className="px-6 py-4 text-purple-200 font-mono">{estudiante.carnet || 'N/A'}</td>
                                            <td className="px-6 py-4 text-white">{estudiante.nombre || 'N/A'}</td>
                                            <td className="px-6 py-4 text-white">{estudiante.apellido || 'N/A'}</td>
                                            <td className="px-6 py-4 text-purple-200">{estudiante.grado || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-xs font-medium ${
                                                    estudiante.estado === 'Activo' 
                                                        ? 'bg-green-500/30 text-green-200 border border-green-400/50' 
                                                        : 'bg-gray-500/30 text-gray-200 border border-gray-400/50'
                                                }`}>
                                                    {estudiante.estado || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(estudiante)}
                                                        className="bg-blue-600/80 hover:bg-blue-700 text-white px-3 py-1 text-sm transition-colors duration-200"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(estudiante._id)}
                                                        className="bg-red-600/80 hover:bg-red-700 text-white px-3 py-1 text-sm transition-colors duration-200"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {filteredEstudiantes.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-purple-200 text-lg">No se encontraron estudiantes</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para crear/editar estudiante */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 w-full max-w-md mx-4">
                        <h3 className="text-2xl font-bold text-white mb-6">
                            {editingStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">Carnet</label>
                                <input
                                    type="text"
                                    value={formData.carnet}
                                    onChange={(e) => setFormData({...formData, carnet: e.target.value})}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:border-green-400"
                                    placeholder="Ej: EST001"
                                />
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-2">Nombre</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:border-green-400"
                                    placeholder="Nombre del estudiante"
                                />
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-2">Apellido</label>
                                <input
                                    type="text"
                                    value={formData.apellido}
                                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:border-green-400"
                                    placeholder="Apellido del estudiante"
                                />
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-2">Grado</label>
                                <select
                                    value={formData.grado}
                                    onChange={(e) => setFormData({...formData, grado: e.target.value})}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/30 text-white focus:outline-none focus:border-green-400"
                                >
                                    <option value="" className="bg-purple-900">Seleccionar grado</option>
                                    <option value="1° Grado" className="bg-purple-900">1° Grado</option>
                                    <option value="2° Grado" className="bg-purple-900">2° Grado</option>
                                    <option value="3° Grado" className="bg-purple-900">3° Grado</option>
                                    <option value="4° Grado" className="bg-purple-900">4° Grado</option>
                                    <option value="5° Grado" className="bg-purple-900">5° Grado</option>
                                    <option value="6° Grado" className="bg-purple-900">6° Grado</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-2">Estado</label>
                                <select
                                    value={formData.estado}
                                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/30 text-white focus:outline-none focus:border-green-400"
                                >
                                    <option value="Activo" className="bg-purple-900">Activo</option>
                                    <option value="Inactivo" className="bg-purple-900">Inactivo</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-8">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 bg-gray-600/80 hover:bg-gray-700 text-white py-3 font-medium transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={editingStudent ? handleUpdate : handleCreate}
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-3 font-medium transform transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                {editingStudent ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
                .font-roboto {
                    font-family: 'Roboto', sans-serif;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;