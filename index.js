const express = require("express");
const User = require("./models").user;
const TodoList = require("./models").todoList;
const PORT = process.env.PORT || 4000;
const app = express();

const cors = require("cors");
app.use(cors());

const bodyParser = express.json();

app.use(bodyParser);

app.get("/users", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.send(users);
  } catch (e) {
    next(e);
  }
});

app.post("/users", async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      res.status(400).send("Missing parameters to create user");
    } else {
      const newUser = await User.create({ email, password, name });
      res.send(newUser);
    }
  } catch (e) {
    next(e);
  }
});

/*  From another document res.json correct? */
app.put("/users/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      const updatedUser = await user.update(req.body);
      res.json(updatedUser);
    }
  } catch (e) {
    next(e);
  }
});

app.get("/users/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (e) {
    console.log(e);
  }
});

app.patch("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    // send some attribute to update.
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).send("user not found");
    } else {
      console.log(req.body);
      await user.update(req.body);
      console.log("user", user);
      res.send(user);
    }
  } catch (e) {
    next(e);
  }
});

app.get("/users/:id/lists", async (req, res, next) => {
  try {
    const { id } = req.params;
    const userWithList = await User.findByPk(id, { include: [TodoList] });
    if (!userWithList) {
      res.status(404).send("User not found");
    } else {
      res.send(userWithList);
    }
  } catch (e) {
    next(e);
  }
});

app.get("/users/:userId/lists", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await User.findByPk(userId, {
      include: [TodoList],
    });
    if (user) {
      res.send(user.TodoLists);
    } else {
      res.status(404).send("User not found");
    }
  } catch (e) {
    next(e);
  }
});

app.post("/users/:userId/lists", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      const newList = await TodoList.create({ userId, ...req.body });
      res.json(newList);
    }
  } catch (e) {
    next(e);
  }
});

// Update an existing list
app.put("/users/:userId/lists/:listId", async (req, res, next) => {
  try {
    const listId = parseInt(req.params.listId);
    const toUpdate = await TodoList.findByPk(listId);
    if (!toUpdate) {
      res.status(404).send("List not found");
    } else {
      const updated = await toUpdate.update(req.body);
      res.json(updated);
    }
  } catch (e) {
    next(e);
  }
});
// Delete a user's list
app.delete("/users/:userId/lists/:listId", async (req, res, next) => {
  try {
    const listId = parseInt(req.params.listId);
    const toDelete = await TodoList.findByPk(listId);
    if (!toDelete) {
      res.status(404).send("List not found");
    } else {
      const deleted = await toDelete.destroy();
      res.json(deleted);
    }
  } catch (e) {
    next(e);
  }
});
// Delete all user's lists
app.delete("/users/:userId/lists", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await User.findByPk(userId, { include: [TodoList] });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      user.TodoLists.forEach(async (list) => await list.destroy());
      res.status(204).send();
    }
  } catch (e) {
    next(e);
  }
});

app.get("/todoLists", async (req, res, next) => {
  const todoLists = await TodoList.findAll();
  res.json(todoLists);
});

app.post("/todoLists", async (req, res, next) => {
  try {
    const newList = await TodoList.create(req.body);
    res.json(newList);
  } catch (e) {
    next(e);
  }
});

app.put("/todoLists/:listId", async (req, res, next) => {
  try {
    const listId = parseInt(req.params.listId);
    const listToUpdate = await TodoList.findByPk(listId);
    if (!listToUpdate) {
      res.status(404).send("List not found");
    } else {
      const updatedList = await listToUpdate.update(req.body);
      res.json(updatedList);
    }
  } catch (e) {
    next(e);
  }
});

app.listen(PORT, () => console.log("server started!"));
