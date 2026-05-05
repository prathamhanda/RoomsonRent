# 📘 **Lec 1: Introduction to MongoDB**

📄 

### Topics:

* Database fundamentals
* DBMS (Database Management System)
* Types of data (strings, numbers, etc.)
* Tabular (Relational) databases
* SQL databases

  * Structure (rows, columns)
  * Relationships (1-1, 1-M, M-M)
  * Schema concept
  * Disadvantages of SQL
* NoSQL databases

  * Definition and need
* Types of NoSQL databases:

  * Key-Value stores
  * Column-oriented databases
  * Document-oriented databases
  * Graph databases
* Introduction to MongoDB

  * Features (open-source, scalable, distributed)
* Collections vs Documents
* JSON vs BSON
* MongoDB document structure
* Document model vs relational model

---

# 📘 **Lec 2: CRUD Operations**

📄 

### Topics:

* CRUD overview:

  * Create
  * Read
  * Update
  * Delete

### Create:

* insert()
* insertOne()
* insertMany()
* _id field (primary key concept)

### Read:

* find()
* findOne()
* Query filters
* Query operators:

  * $in

### Update:

* updateOne()
* updateMany()
* replaceOne()

### Delete:

* deleteOne()
* deleteMany()
* drop() (collection deletion)

### Querying Concepts:

* Equality queries
* Logical operators:

  * $and, $or, $not, $nor
* Comparison operators:

  * $eq, $gt, $lt, $gte, $lte

---

# 📘 **Lec 3: Nested / Embedded Documents**

📄 

### Topics:

* Nested / embedded documents concept
* Documents inside documents

### Querying:

* Dot notation
* Querying nested fields
* Exact match of embedded documents
* Field order importance

### Arrays of embedded documents:

* Query conditions inside arrays
* Index-based querying (array index)

### Advanced querying:

* $elemMatch operator
* Multiple condition queries
* Combination vs single element matching

---

# 📘 **Lec 4: Update Operators**

📄 

### Topics:

* updateOne(), updateMany() recap

### Update Operators:

* $inc (increment/decrement)
* $rename (rename fields)
* $mul (multiply values)
* $set (update/add fields)
* $unset (remove fields)

### Concepts:

* Dot notation for embedded fields
* Behavior when fields don’t exist
* Type handling in updates

---

# 📘 **Lec 5: Arrays in MongoDB**

📄 

### Topics:

* Array basics in MongoDB
* Creating arrays

### Querying arrays:

* Exact match
* $all operator
* Query by element
* Query with conditions ($gt, $lt)
* $elemMatch
* Index-based queries
* Array length ($size)

### Array Update Operators:

* $pop (remove first/last)
* $pull (remove matching values)
* $pullAll
* $push (add elements)
* $each modifier
* $addToSet (no duplicates)

---

# 📘 **Lec 6: Indexing**

📄 

### Topics:

* What is indexing
* B-tree structure
* Need for indexing (performance optimization)

### Index basics:

* Default index (_id)
* Creating indexes
* Index naming
* Dropping indexes
* Hiding/unhiding indexes

### Index types:

1. Single Field Index
2. Compound Index
3. Multikey Index (arrays)
4. Text Index

### Concepts:

* Embedded field indexing
* Index on embedded documents
* Covered queries
* Index sort order
* Prefix rule (compound index)

---

# 📘 **Lec 7: Sharding & Scaling**

📄 

### Topics:

## Database Scaling:

* Vertical scaling (scale-up)
* Horizontal scaling (scale-out)

## Data Distribution:

* Replication

  * Master-slave
  * Peer-to-peer
* Sharding

## Sharding Concepts:

* Definition of sharding
* Need for sharding
* Sharding architecture

### Components:

* Shards
* Mongos (query router)
* Config servers

### Working:

* Query routing
* Data distribution

### Shard Key:

* Definition
* Importance
* Immutable nature

### Advanced Concepts:

* Logical vs Physical shard
* Chunks & balancer
* Chunk distribution

### Choosing shard key:

* Cardinality
* Frequency
* Query patterns
* Avoid monotonic keys

---

# ✅ **Final Quick Revision List (All Topics Combined)**

If you want ultra-short revision:

* MongoDB basics & NoSQL
* CRUD operations
* Query operators
* Nested documents
* Arrays + array operators
* Update operators
* Indexing (types + usage)
* Sharding & scaling
* Replication