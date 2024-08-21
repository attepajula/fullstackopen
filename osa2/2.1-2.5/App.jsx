// App.jsx
import React from 'react';
import './App.css';
import Course from './Course';

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10
        },
        {
          name: 'Using props to pass data',
          exercises: 7
        },
        {
          name: 'State of a component',
          exercises: 14
        }
      ]
    },
    {
      name: 'Advanced JavaScript',
      parts: [
        {
          name: 'Closures',
          exercises: 5
        },
        {
          name: 'Promises',
          exercises: 8
        },
        {
          name: 'Async/Await',
          exercises: 12
        }
      ]
    },
    {
      name: 'Serious Haxxing',
      parts: [
        {
          name: 'Reverse Engineering',
          exercises: 6
        },
        {
          name: 'Machine Learning',
          exercises: 14
        },
        {
          name: 'Quantum Computing',
          exercises: 11
        }
      ]
    }
    // Lisääppä kursseja
  ];
  return (
    <div>
      {courses.map((course, index) => (
        <Course key={index} name={course.name} parts={course.parts} />
      ))}
    </div>
  );
};

export default App;