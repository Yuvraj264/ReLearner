export const simulateEmail = async (req, res) => {
    try {
        const { email, type } = req.body;

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log(`[SIMULATION] Sending '${type}' email to ${email}`);

        res.status(200).json({
            success: true,
            message: `Simulated ${type} email sent to ${email}`
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to simulate email" });
    }
};
