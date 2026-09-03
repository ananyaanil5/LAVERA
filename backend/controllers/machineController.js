const machineRepository = require('../repositories/machineRepository');

class MachineController {
    async getAllMachines(req, res) {
        try {
            const machines = await machineRepository.findAll();
            res.json({ machines });
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve machine statuses.' });
        }
    }

    async updateMachine(req, res) {
        try {
            const { status, capacityPct, currentOrderId, notes } = req.body;
            await machineRepository.updateStatus(req.params.id, status, capacityPct, currentOrderId, notes);
            const updated = await machineRepository.findById(req.params.id);
            res.json({ message: 'Machine status updated successfully.', machine: updated });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update machine.' });
        }
    }
}

module.exports = new MachineController();
