const Header = ({ course }) => {
  console.log(course)
  return (
    <div>
      <p>{course}</p>
    </div>
  )
}

const Content = ({ content }) => {
  console.log(content)
  return (
    <div>
        <Part part={content[0]}/>
        <Part part={content[1]}/>
        <Part part={content[2]}/>
      </div>
    )
  }
  
const Part = ({ part }) => {
  console.log(part)
  return (
    <div>
      <p>{part[0]} {part[1]}</p>
    </div>
  )
}

const Total = ({ total }) => {
  console.log(total)
  return (
    <div>
      <p>Number of exercises {total}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const exercises1 = 10
  const exercises2 = 7
  const exercises3 = 14
  const content = [['Fundamentals of React', exercises1], ['Using props to pass data', exercises2], ['State of a component', exercises3]]
  const total = exercises1 + exercises2 + exercises3

  return (
    <div>
      <Header course={course} />
      <Content content={content} />
      <Total total={total} />
    </div>
  )
}

export default App
