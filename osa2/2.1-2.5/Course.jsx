const Course = ({ name, parts }) => {
    const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
  
    return (
      <div>
        <h1>{name}</h1>
        {parts.map((part, index) => (
          <Part key={index} name={part.name} exercises={part.exercises} />
        ))}
        <p><strong>Total of {totalExercises} exercises</strong></p>
      </div>
    );
  };
  
  const Part = ({ name, exercises }) => {
    return (
      <p>{name} {exercises}</p>
    );
  };

  export default Course;