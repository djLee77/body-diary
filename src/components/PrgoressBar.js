import React from "react";
import * as Progress from "react-native-progress";
 
const BarView = styled.View`
  width: 100%;
  padding: 0 15px;
  flex-direction: row;
  margin-top: 20px;
`;
 
const Bar = styled.View`
  margin: 10px 0;
  flex: 1;
`;
 
const BarText = styled.Text`
  width: 40px;
  text-align: center;
  font-size: 15px;
  font-family: ${({ theme }) => theme.fontSub};
  padding: 3px 0 0 5px;
`;
 
const ProgressBar = ({ tasks }) => {
  const tasksValue = Object.values(tasks);
  const length = tasksValue.length;
  const completed = tasksValue.filter((task) => task.completed === true).length;
  return (
    <BarView>
      <Bar>
        <Progress.Bar
          progress={completed / length}
          width={null}
          height={8}
          color={"rgba(51, 65, 159, 0.8)"}
        />
      </Bar>
      <BarText>
        {completed}/{length}
      </BarText>
    </BarView>
  );
};
 
export default ProgressBar;
