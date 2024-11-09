// functions/updateExpense.js
const { Expense } = require('../models');  // Import the Expense model

exports.handler = async (event, context) => {
  try {
    const { id, ...updateData } = JSON.parse(event.body);  // Get ID and fields to update

    // Find the expense and update it with new data
    const [updated] = await Expense.update(updateData, { where: { id } });

    if (updated) {
      const updatedExpense = await Expense.findOne({ where: { id } });
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Expense updated successfully", expense: updatedExpense })
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `Expense with ID ${id} not found` })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to update expense", error: error.message })
    };
  }
};