import mongoose from 'mongoose';

const { Schema } = mongoose;

const logSchema = new Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new Schema({
  username: { type: String, required: true },
  count: { type: Number, default: 0 },
  log: [logSchema] // Usando el subesquema de log
}, 
{
  methods: {
    setCount() {
      this.count = this.log.length;
      return this.save();
    },
    addToLog(logObject) {
      this.log.push(logObject);
      return this.save();
    }
  }
}
);  

userSchema.virtual('formattedDate').get(function() {
  return this.log.map(log => log.date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }));
});

const User = mongoose.model('User', userSchema);

export default User;
