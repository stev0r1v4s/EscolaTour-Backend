import { destinationService } from '../services/destination.service.js';

class DestinationController {
  async getDestinations(req, res) {
    try {
      const filters = {
        category: req.query.category,
        search: req.query.search || req.query.searchQuery, // Support both naming styles
        priceMax: req.query.priceMax
      };

      const destinations = await destinationService.getDestinations(filters);
      return res.status(200).json(destinations);
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error al listar los destinos.',
        error: error.message 
      });
    }
  }

  async getTopDestinations(req, res) {
    try {
      const limit = parseInt(req.query.limit, 10) || 5;
      const destinations = await destinationService.getTopDestinations(limit);
      return res.status(200).json(destinations);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al obtener los destinos más visitados.',
        error: error.message
      });
    }
  }

  async getDestinationById(req, res) {
    const { id } = req.params;
    try {
      const destination = await destinationService.getDestinationById(id);
      return res.status(200).json(destination);
    } catch (error) {
      return res.status(404).json({ 
        message: error.message || 'Destino no encontrado.' 
      });
    }
  }

  async createDestination(req, res) {
    try {
      // Validate inputs
      const { title, location, price, category, description } = req.body;
      if (!title || !location || !price || !category || !description) {
        return res.status(400).json({
          message: 'Todos los campos básicos son obligatorios (title, location, price, category, description).'
        });
      }

      // req.files is populated by Multer field mapping
      const destination = await destinationService.createDestination(req.body, req.files);
      return res.status(201).json({
        message: 'Destino creado exitosamente.',
        destination
      });
    } catch (error) {
      return res.status(400).json({ 
        message: error.message || 'Error al crear el destino.' 
      });
    }
  }

  async updateDestination(req, res) {
    const { id } = req.params;
    try {
      const destination = await destinationService.updateDestination(id, req.body, req.files);
      return res.status(200).json({
        message: 'Destino actualizado exitosamente.',
        destination
      });
    } catch (error) {
      return res.status(400).json({ 
        message: error.message || 'Error al actualizar el destino.' 
      });
    }
  }

  async deleteDestination(req, res) {
    const { id } = req.params;
    try {
      await destinationService.deleteDestination(id);
      return res.status(200).json({
        message: 'Destino eliminado exitosamente.'
      });
    } catch (error) {
      return res.status(400).json({ 
        message: error.message || 'Error al eliminar el destino.' 
      });
    }
  }
}

export const destinationController = new DestinationController();
