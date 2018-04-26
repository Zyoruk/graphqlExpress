const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

/*/Hardcoded data
const customers = [
  {id:'1',name:'John Doe',email:'jdoe@gmail.com',age:35},
  {id:'2',name:'James Padela',email:'jpadel@gmail.com',age:25},
  {id:'3',name:'Sara Mochelini',email:'smoche@gmail.com',age:18},
]
*/
const employees = [
  {id:'1',name:'Luis',nickname:'Tito',age:25},
  {id:'2',name:'Aaron',nickname:'Nigga',age:21},
  {id:'3',name:'Victor',nickname:'torVic',age:38},
]

//Customer Type
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: {type:GraphQLString},
    name: {type:GraphQLString},
    email: {type: GraphQLString},
    age: {type: GraphQLInt},
  })
});

//custom para la demostracion :D
const EmployeeType = new GraphQLObjectType({
  name: 'Employee',
  fields:() => ({
    id: {type:GraphQLString},
    name: {type:GraphQLString},
    nickname: {type: GraphQLString},
    age: {type: GraphQLInt},
  })
});

//Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
 fields:{ //Singular para 1
  customer:{
    type:CustomerType,
    args:{
      id:{type:GraphQLString}
    },
    resolve(parentValue, args){
    /*for(let i = 0; i < customers.length; i++){
        if (customers[i].id == args.id) {
          return customers[i];
        }
      }*/
      return axios.get(`http://localhost:3000/customers/${args.id}`).then(res => res.data)
    }
  }, //Plural para todo
  customers:{
    type: new GraphQLList(CustomerType),
    resolve(parentValue, args){
      return axios.get(`http://localhost:3000/customers`).then(res => res.data)
    }
  },
  employee:{
    type:EmployeeType,
    args:{
      id:{type:GraphQLString}
    },
    resolve(parentValue, args){
      for(let i = 0; i < employees.length; i++){
        if (employees[i].id == args.id) {
          return employees[i];
        }
      }
    }
  },
  employees:{
    type: new GraphQLList(EmployeeType),
    resolve(parentValue, args){
      return employees;
    }
  }
 }
});

const mutation = new GraphQLObjectType({
  name:'Mutation',
  fields:{
    addCustomer:{
      type:CustomerType,
      args:{
        name:{type: new GraphQLNonNull(GraphQLString)},
        email:{type: new GraphQLNonNull(GraphQLString)},
        age:{type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parentValue, args){
        return axios.post('http://localhost:3000/customers',{
          name:args.name,
          email:args.email,
          age:args.age
        })
        .then(res => res.data)
      }
    },
    deleteCustomer:{
      type:CustomerType,
      args:{
        id:{type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, args){
        return axios.delete(`http://localhost:3000/customers/${args.id}`)
        .then(res => res.data)
      }
    },
    editCustomer:{
      type:CustomerType,
      args:{
        id:{type: new GraphQLNonNull(GraphQLString)},
        name:{type: GraphQLString},
        email:{type: GraphQLString},
        age:{type: GraphQLInt}
      },
      resolve(parentValue, args){
        return axios.patch(`http://localhost:3000/customers/${args.id}`, args)
        .then(res => res.data)
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});