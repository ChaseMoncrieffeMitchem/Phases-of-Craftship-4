import express, { Request, Response } from 'express';
import { prisma } from './database';
import { isMissingKeys, generateRandomPassword, parseUserForResponse } from './utils/utils';
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())

const Errors = {
  
  UsernameAlreadyTaken: 'UserNameAlreadyTaken',
  EmailAlreadyInUse: 'EmailAlreadyInUse',
  ValidationError: 'ValidationError',
  ServerError: 'ServerError',
  ClientError: 'ClientError',
  UserNotFound: 'UserNotFound'
}



// Create a new user
app.post('/users/new', async (req: Request, res: Response) => {
  try {
    const keyIsMissing = isMissingKeys(req.body, 
      ['email', 'firstName', 'lastName', 'username']
    );
    
    if (keyIsMissing) {
      return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false })
    }

    const userData = req.body;
    
    const existingUserByEmail = await prisma.user.findFirst({ where: { email: req.body.email }});
    if (existingUserByEmail) {
      return res.status(409).json({ error: Errors.EmailAlreadyInUse, data: undefined, success: false })
    }

    const existingUserByUsername = await prisma.user.findFirst({ where: { username: req.body.username as string }});
    if (existingUserByUsername) {
      return res.status(409).json({ error: Errors.UsernameAlreadyTaken, data: undefined, success: false })
    }

    const { user, member } = await prisma.$transaction(async (tx) => {
      const user = await prisma.user.create({ data: { ...userData, password: generateRandomPassword(10) } });
      const member = await prisma.member.create({ data: { userId: user.id }})
      return { user, member }
    })
    
    return res.status(201).json({ error: undefined, data: parseUserForResponse(user), success: true });
  } catch (error) {
    console.log(error)
    // Return a failure error response
    return res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
  }
});


// Get a user by email
app.get('/users', async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    if (email === undefined) {
      return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false })
    }
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: Errors.UserNotFound, data: undefined, success: false })
    }

    return res.status(200).json({ error: undefined, data: parseUserForResponse(user), succes: true });
  } catch (error) {
    return res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
  }
});

// Get posts
app.get('/posts', async (req: Request, res: Response) => {
  try {
    const { sort } = req.query;
    
    if (sort !== 'recent') {
      return res.status(400).json({ error: Errors.ClientError, data: undefined, success: false })
    } 

    let postsWithVotes = await prisma.post.findMany({
      include: {
        votes: true, // Include associated votes for each post
        memberPostedBy: {
          include: {
            user: true
          }
        },
        comments: true
      },
      orderBy: {
        dateCreated: 'desc', // Sorts by dateCreated in descending order
      },
    });

    return res.json({ error: undefined, data: { posts: postsWithVotes }, success: true });
  } catch (error) {
    return res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
  }
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


prisma.post.findMany({})
  .then((posts) => console.log(posts))
  .catch((err) => console.log(err));


// import express, { Request, Response } from 'express';
// import { prisma } from './database';
// import { isMissingKeys, generateRandomPassword, parseUserForResponse } from './utils/utils';
// const cors = require('cors')
// const app = express();
// app.use(express.json());
// app.use(cors())

// const Errors = {
//   UsernameAlreadyTaken: 'UserNameAlreadyTaken',
//   EmailAlreadyInUse: 'EmailAlreadyInUse',
//   ValidationError: 'ValidationError',
//   ServerError: 'ServerError',
//   ClientError: 'ClientError',
//   UserNotFound: 'UserNotFound'
// }



// // Create a new user
// app.post('/users/new', async (req: Request, res: Response) => {
//   try {
//     const keyIsMissing = isMissingKeys(req.body, 
//       ['email', 'firstName', 'lastName', 'username']
//     );
    
//     if (keyIsMissing) {
//       return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false })
//     }

//     const userData = req.body;
    
//     const existingUserByEmail = await prisma.user.findFirst({ where: { email: req.body.email }});
//     if (existingUserByEmail) {
//       return res.status(409).json({ error: Errors.EmailAlreadyInUse, data: undefined, success: false })
//     }

//     const existingUserByUsername = await prisma.user.findFirst({ where: { username: req.body.username as string }});
//     if (existingUserByUsername) {
//       return res.status(409).json({ error: Errors.UsernameAlreadyTaken, data: undefined, success: false })
//     }

//     const { user, member } = await prisma.$transaction(async (tx) => {
//       const user = await prisma.user.create({ data: { ...userData, password: generateRandomPassword(10) } });
//       const member = await prisma.member.create({ data: { userId: user.id }})
//       return { user, member }
//     })
    
//     return res.status(201).json({ error: undefined, data: parseUserForResponse(user), success: true });
//   } catch (error) {
//     console.log(error)
//     // Return a failure error response
//     return res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//   }
// });


// // Get a user by email
// app.get('/users', async (req: Request, res: Response) => {
//   try {
//     const email = req.query.email as string;
//     if (email === undefined) {
//       return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false })
//     }
    
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       return res.status(404).json({ error: Errors.UserNotFound, data: undefined, success: false })
//     }

//     return res.status(200).json({ error: undefined, data: parseUserForResponse(user), succes: true });
//   } catch (error) {
//     return res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//   }
// });

// // Get posts
// app.get('/posts', async (req: Request, res: Response) => {
//   try {
//     const { sort } = req.query;
    
//     if (sort !== 'recent') {
//       return res.status(400).json({ error: Errors.ClientError, data: undefined, success: false })
//     } 

//     let postsWithVotes = await prisma.post.findMany({
//       include: {
//         votes: true, // Include associated votes for each post
//         memberPostedBy: {
//           include: {
//             user: true
//           }
//         },
//         comments: true
//       },
//       orderBy: {
//         dateCreated: 'desc', // Sorts by dateCreated in descending order
//       },
//     });

//     return res.json({ error: undefined, data: { posts: postsWithVotes }, success: true });
//   } catch (error) {
//     return res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//   }
// });
// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


// prisma.post.findMany({})
//   .then((posts) => console.log(posts))
//   .catch((err) => console.log(err));
