const mongoose = require('mongoose');

//Connecting to MongoDB Atlas with Mongoose
mongoose.connect("mongodb+srv://nodejs:abc987621@cluster0.wdx3u1b.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
//"on" and "once" returns me if we connected to the database or not
db.on('error', () => {
    console.log('Mongoose didnt connect');
});
db.once('open',() => {
    console.log("connected");
});

// Creating schemas for users,costs and report collections
const usersSchema = new mongoose.Schema({
    id : Number,
    firstname : String,
    lastname : String,
    birthday : Date
});

const costSchema = new mongoose.Schema({
    user_id: { type: Number, required: true },
    year: { type: Number, required: false },
    month: { type: Number, required: false },
    day: { type: Number, required: false },
    id: {type: mongoose.Schema.Types.ObjectId, auto: true} ,
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ['food', 'health', 'housing', 'sport', 'education', 'transportation', 'other'] },
    sum: { type: Number, required: true }
});

const reportSchema = new mongoose.Schema({
    user_id: { type: Number, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    report: { type: JSON, required: true, default: {'food':[], 'health':[], 'housing':[], 'sport':[], 'education':[], 'transportation':[], 'other':[]}}
});

// Creating "Cost", "User", "Report" models that represents a collection in MongoDB
//and uses the schemas for the structure of the documents within the specific collection
const Cost = mongoose.model('cost', costSchema);
const User = mongoose.model('user', usersSchema);
const Report = mongoose.model('report', reportSchema);


// We created a single imaginary document in users collection
const user = new User({
    id: 123123,
    firstname: 'moshe',
    lastname: 'israeli',
    birthday: new Date(1990, 0, 11)
});


// check if the user already exists
async function UserExists(user_id) {
    return new Promise(async (resolve, reject) => {
        const existingUser = await User.findOne({id: user_id});
        if (existingUser) {
            resolve(true);
        }
        else{
            resolve(false);
        }
    });
}



// Function that check if the user exists, if not creates him
async function CreateUserIfNotExists(user) {
    const userExists = await UserExists(user.id);
    if (userExists) {
        console.log("user already exists and not created");
        return;
    }
    else {
        try {
            const newUser = await User.create(user);
            console.log(`new User created: ${newUser}`);
            return newUser;
        }
        catch (err){
            console.error(err);
            throw err;
        }
    }
}

CreateUserIfNotExists(user).catch(console.error);

module.exports = {Cost,UserExists,Report};

