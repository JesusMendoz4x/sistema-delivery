const Usuario = require('../models/Usuario');

exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, telefono, direccion, rol, estado } = req.body;
        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password,
            telefono,
            direccion,
            rol,
            estado
        });

        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
}

exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().sort({ createdAt: -1 });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
}

exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
}

exports.actualizarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
}

exports.desactivarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, { estado: 'inactivo' }, {
            new: true,
            runValidators: true
        });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar el usuario', error: error.message });
    }
}

exports.activarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, { estado: 'activo' }, {
            new: true,
            runValidators: true
        });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al activar el usuario', error: error.message });
    }
}

const jwt = require('jsonwebtoken');

exports.loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'El correo y la contraseña son obligatorios' });
        }

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        if (usuario.estado === 'inactivo') {
            return res.status(403).json({ message: 'El usuario está inactivo. Contacte al administrador.' });
        }

        // Comparación simple de contraseña en texto plano
        if (usuario.password !== password) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const secret = process.env.JWT_SECRET || 'secreto_super_seguro_delivery';
        const token = jwt.sign(
            { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
            secret,
            { expiresIn: '8h' }
        );

        res.json({
            ok: true,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el proceso de login', error: error.message });
    }
}
