const Task = require('../models/Task');
const redisClient = require('../utils/redisClient');

exports.createTask = async (req, res, next) => {
  try {
    const { title, inputText, operation } = req.body;

    const task = await Task.create({
      title,
      inputText,
      operation,
      userId: req.user._id,
      status: 'pending'
    });

    // Push to Redis queue
    await redisClient.lPush('task_queue', JSON.stringify({
      taskId: task._id,
      inputText: task.inputText,
      operation: task.operation
    }));

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort('-createdAt');
    res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { title, inputText, operation } = req.body;
    
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const reprocess = (inputText && inputText !== task.inputText) || (operation && operation !== task.operation);

    task.title = title || task.title;
    if (inputText) task.inputText = inputText;
    if (operation) task.operation = operation;

    if (reprocess) {
      task.status = 'pending';
      task.result = null;
      task.logs.push('Task updated, re-queueing for processing');
    }

    await task.save();

    if (reprocess) {
      await redisClient.lPush('task_queue', JSON.stringify({
        taskId: task._id,
        inputText: task.inputText,
        operation: task.operation
      }));
    }

    res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
