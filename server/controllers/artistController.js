const Artist = require('../models/Artist');

exports.getArtists  = async (req, res) => { try { res.json(await Artist.find().sort({ name: 1 })); } catch (e) { res.status(500).json({ message: e.message }); } };
exports.getArtist   = async (req, res) => { try { const a = await Artist.findById(req.params.id); if (!a) return res.status(404).json({ message: 'Not found' }); res.json(a); } catch (e) { res.status(500).json({ message: e.message }); } };
exports.createArtist = async (req, res) => { try { res.status(201).json(await Artist.create(req.body)); } catch (e) { res.status(400).json({ message: e.message }); } };
exports.updateArtist = async (req, res) => { try { const a = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!a) return res.status(404).json({ message: 'Not found' }); res.json(a); } catch (e) { res.status(400).json({ message: e.message }); } };
exports.deleteArtist = async (req, res) => { try { await Artist.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted.' }); } catch (e) { res.status(500).json({ message: e.message }); } };
