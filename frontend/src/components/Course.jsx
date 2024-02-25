import CourseComponent from './CourseComponent';
import CourseSection from './CourseSection';

const Course = ({ course }) => {
  return (
    <div className="flex h-min w-full flex-col overflow-clip rounded-md text-sm">
      <div className="flex h-min w-full gap-4 bg-lime-300 p-2 text-base">
        <input type="checkbox" />
        <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
          {course.courseCode}: {course.courseName}
        </span>
      </div>

      {course.sections.map((section, i) => {
        return (
          <div key={i}>
            <CourseSection section={section} />
            <div className="space-y-[2px]">
              <CourseComponent type="LEC" component={section.lecture} />

              {section.labs.map((lab, i) => {
                return <CourseComponent key={i} type="LAB" component={lab} />;
              })}

              {section.dgds.map((lab, i) => {
                return <CourseComponent key={i} type="DGD" component={lab} />;
              })}

              {section.tutorials.map((lab, i) => {
                return <CourseComponent key={i} type="TUT" component={lab} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Course;
