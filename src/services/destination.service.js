import { destinationRepository } from '../repositories/destination.repository.js';
import path from 'path';

class DestinationService {
  /**
   * Helper to format benefits array from request
   */
  _parseBenefits(benefits) {
    if (!benefits) return [];
    if (Array.isArray(benefits)) return benefits;
    
    if (typeof benefits === 'string') {
      try {
        // Try parsing as JSON array
        const parsed = JSON.parse(benefits);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // Fallback: split by comma if not valid JSON
        return benefits.split(',').map(b => b.trim()).filter(Boolean);
      }
    }
    return [];
  }

  async getDestinations(filters) {
    return destinationRepository.findAll(filters);
  }

  async getTopDestinations(limit = 5) {
    return destinationRepository.findTopVisited(limit);
  }

  async getDestinationById(id) {
    const destination = await destinationRepository.findById(id);
    if (!destination) {
      throw new Error('Destino no encontrado.');
    }
    return destination;
  }

  async createDestination(destinationData, files = {}) {
    const parsedBenefits = this._parseBenefits(destinationData.benefits);
    
    // Process files
    let imageUrl = destinationData.imageUrl || '';
    let pedagogicalGuideUrl = destinationData.pedagogicalGuideUrl || '';

    if (files.image && files.image[0]) {
      // Save path relative to backend root
      imageUrl = `/uploads/images/${files.image[0].filename}`;
    }

    if (files.pedagogicalGuide && files.pedagogicalGuide[0]) {
      pedagogicalGuideUrl = `/uploads/documents/${files.pedagogicalGuide[0].filename}`;
    }

    const price = parseFloat(destinationData.price);
    const latitude = parseFloat(destinationData.latitude || 0);
    const longitude = parseFloat(destinationData.longitude || 0);
    const rating = parseFloat(destinationData.rating || 5.0);

    if (isNaN(price)) {
      throw new Error('El precio debe ser un número válido.');
    }

    return destinationRepository.create({
      title: destinationData.title,
      location: destinationData.location,
      price,
      category: destinationData.category,
      description: destinationData.description,
      imageUrl,
      pedagogicalGuideUrl,
      benefits: parsedBenefits,
      latitude,
      longitude,
      rating,
      status: destinationData.status || 'Borrador'
    });
  }

  async updateDestination(id, updateData, files = {}) {
    const existing = await destinationRepository.findById(id);
    if (!existing) {
      throw new Error('Destino no encontrado para actualizar.');
    }

    const dataToUpdate = {};

    if (updateData.title !== undefined) dataToUpdate.title = updateData.title;
    if (updateData.location !== undefined) dataToUpdate.location = updateData.location;
    if (updateData.category !== undefined) dataToUpdate.category = updateData.category;
    if (updateData.description !== undefined) dataToUpdate.description = updateData.description;
    
    if (updateData.price !== undefined) {
      const price = parseFloat(updateData.price);
      if (isNaN(price)) throw new Error('El precio debe ser un número válido.');
      dataToUpdate.price = price;
    }

    if (updateData.latitude !== undefined) {
      dataToUpdate.latitude = parseFloat(updateData.latitude);
    }
    if (updateData.longitude !== undefined) {
      dataToUpdate.longitude = parseFloat(updateData.longitude);
    }
    if (updateData.rating !== undefined) {
      dataToUpdate.rating = parseFloat(updateData.rating);
    }
    if (updateData.status !== undefined) {
      dataToUpdate.status = updateData.status;
    }

    if (updateData.benefits !== undefined) {
      dataToUpdate.benefits = this._parseBenefits(updateData.benefits);
    }

    // Check for updated files
    if (files.image && files.image[0]) {
      dataToUpdate.imageUrl = `/uploads/images/${files.image[0].filename}`;
    }
    if (files.pedagogicalGuide && files.pedagogicalGuide[0]) {
      dataToUpdate.pedagogicalGuideUrl = `/uploads/documents/${files.pedagogicalGuide[0].filename}`;
    }

    return destinationRepository.update(id, dataToUpdate);
  }

  async deleteDestination(id) {
    const existing = await destinationRepository.findById(id);
    if (!existing) {
      throw new Error('Destino no encontrado para eliminar.');
    }
    return destinationRepository.delete(id);
  }
}

export const destinationService = new DestinationService();
