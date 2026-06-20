# Blog App Backend API

### From "What is ObjectId?" to Building Authentication, Authorization & Admin Controls

## Introduction

This project started as a simple backend blog application.

Initially, my goal was straightforward:

* Register users
* Login users
* Create blogs

However, while building it, I discovered that backend development is much more about designing data flow and responsibilities than writing CRUD operations.

This project became my first practical experience with:

* Authentication
* Authorization
* Ownership Validation
* Role Based Access Control
* MongoDB Relationships
* Middleware Architecture

More importantly, it helped me understand **why these concepts exist** rather than simply using them.

---

# Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* Cloudinary

---

# Project Features

## Authentication

* User Registration
* User Login
* Password Hashing
* JWT Generation
* Protected Routes

## Blog Management

* Create Blog
* Upload Blog Images
* Get All Blogs
* Get Blog By ID
* Update Blog
* Replace Blog Images
* Delete Blog
* Delete Associated Cloudinary Images

## Authorization

* Users can only edit their own blogs
* Users can only delete their own blogs

## Admin Features

* View All Users
* Delete Any User
* Delete User's Blogs Automatically
* Role Based Access Control

---

# Folder Structure

```text
project/
│
├── controllers/
│   ├── auth-controller.js
│   ├── blog-controller.js
│   └── admin-controller.js
│
├── middleware/
│   ├── auth-middleware.js
│   ├── admin-middleware.js
│   └── changes-middleware.js
│
├── models/
│   ├── User.js
│   └── Blog.js
│
├── routes/
│   ├── auth-route.js
│   ├── blog-route.js
│   └── admin-route.js
│
├── database/
│   └── db.js
│
└── server.js
```

---

# Database Design

## User Model

```javascript
{
  username,
  email,
  password,
  role
}
```

## Blog Model

```javascript
{
  title,
  image: {
    url,
    publicId
  },
  content,
  author
}
```

Relationship:

```mermaid
erDiagram

USER ||--o{ BLOG : creates

USER {
    ObjectId _id
    string username
    string email
    string role
}

BLOG {
    ObjectId _id
    string title
    string content
    string imageUrl
    string imagePublicId
    ObjectId author
}
```

---

# Registration Flow

```mermaid
flowchart TD

A[Register Request]
--> B[Check Existing User]

B --> C{User Exists?}

C -->|Yes| D[400 User Already Exists]

C -->|No| E[Hash Password]

E --> F[Create User]

F --> G[Save User]

G --> H[201 Created]
```

---

# Login Flow

```mermaid
flowchart TD

A[Login Request]

--> B[Find User]

B --> C{User Exists?}

C -->|No| D[404 User Not Found]

C -->|Yes| E[Compare Password]

E --> F{Password Match?}

F -->|No| G[400 Invalid Credentials]

F -->|Yes| H[Generate JWT]

H --> I[Return Token]
```

---

# Authentication Middleware Flow

```mermaid
flowchart TD

A[Request]
--> B[Read Header]

B --> C{Token Exists}

C -->|No| D[Unauthorized]

C -->|Yes| E[Verify Token]

E --> F{Valid Token}

F -->|No| G[Unauthorized]

F -->|Yes| H[Attach User Info]

H --> I[Next]
```

---

# Blog Creation Flow

One important realization:

The frontend should never decide who the author is.

The authenticated user automatically becomes the author.

```mermaid
flowchart TD

A[Create Blog Request]

--> B[Auth Middleware]

B --> C[Get User ID From JWT]

C --> D[Read Title and Content]

D --> E[Create Blog]

E --> F[author = req.userInfo.userId]

F --> G[Save Blog]
```

---
# Image Upload Flow

```mermaid
flowchart TD

A[Create Blog Request]
--> B[Multer Receives File]

B --> C[Upload To Cloudinary]

C --> D[Receive URL & PublicId]

D --> E[Delete Temporary Local File]

E --> F[Store URL & PublicId In Blog]

F --> G[Save Blog]
```

---

# Ownership Validation Flow

A user should not be able to modify another user's blog.

```mermaid
flowchart TD

A[Update Delete Request]
--> B[Find Blog]

B --> C{Blog Exists}

C -->|No| D[Not Found]

C -->|Yes| E[Compare Owner]

E --> F{Owner Matches}

F -->|No| G[Forbidden]

F -->|Yes| H[Allow Request]
```

---

# Admin Authorization Flow

```mermaid
flowchart TD

A[Admin Route Request]
--> B[Auth Middleware]

B --> C[Read User Role]

C --> D{Is Admin}

D -->|No| E[Forbidden]

D -->|Yes| F[Continue]
```

---

# Delete User Flow

```mermaid
flowchart TD

A[Delete User Request]

--> B{Trying To Delete Self?}

B -->|Yes| C[403 Forbidden]

B -->|No| D[Find User]

D --> E{User Exists?}

E -->|No| F[404 Not Found]

E -->|Yes| G[Delete User]

G --> H[Delete All Blogs By User]

H --> I[200 Success]
```

---

# What Confused Me Initially

## 1. ObjectId and ref

When I first saw:

```javascript
author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}
```

I thought:

> Why are we storing ObjectId?
>
> Why not store username directly?

Eventually I realized:

```text
User._id never changes

Username can change
```

Using ObjectId creates a reliable relationship.

---

## 2. Why Populate Exists

Initially my blogs returned:

```json
{
  "author": "65ab34..."
}
```

I kept wondering:

> Why would a user want to see an ObjectId?

Then I discovered:

```javascript
.populate("author", "username")
```

After that:

```json
{
  "author": {
    "username": "raees04"
  }
}
```

This was the moment MongoDB references finally clicked.

---

## 3. req.userInfo Confusion

Initially I treated:

```javascript
req.userInfo.userId
```

and

```javascript
req.params.id
```

as similar things.

Eventually I realized:

```text
req.userInfo.userId
=
Currently Logged In User

req.params.id
=
Resource Being Requested
```

That distinction became extremely important for:

* Blog ownership
* Admin controls
* User deletion

---

## 4. The Admin Deletes Himself Problem

One unexpected issue appeared.

My admin could delete any user.

Then I realized:

The admin could also delete himself.

Technically the code worked.

Logically it was wrong.

This taught me an important lesson:

```text
Authentication
≠
Business Rules
```

Applications must also enforce sensible behavior.

---

## 5. Middleware Finally Clicked

Initially middleware felt magical.

Later it became clear:

```text
Middleware
=
Reusable Gatekeeper
```

Authentication:

```text
Who are you?
```

Authorization:

```text
Are you allowed?
```

Ownership:

```text
Do you own this resource?
```

Each concern belongs in its own layer.

---

# Biggest Takeaways

This project taught me that backend development is mostly about designing flow.

The difficult part was not remembering syntax.

The difficult part was deciding:

* What belongs in middleware?
* What belongs in controllers?
* When should a route be protected?
* How should users and blogs be related?
* How should authorization be enforced?

Once those decisions became clear, the implementation became much easier.

---

# Future Improvements

* Refresh Tokens
* Pagination
* Search Blogs
* Comments System
* Likes
* Input Validation
* Rate Limiting
* Docker Deployment
* CI/CD Pipeline

---

# Final Reflection

Before this project, I could read backend code.

After this project, I started understanding the reasoning behind backend architecture.

The biggest realization was that backend development is not about memorizing methods.

It is about understanding data flow:

```text
Request
→ Middleware
→ Controller
→ Cloudinary
→ Database
→ Response
```

Once that flow clicked, concepts like JWT, middleware, authorization, ownership checks, populate(), and role-based access control started making sense naturally.



