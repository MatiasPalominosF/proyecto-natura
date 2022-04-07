///////////////////// start PieChart////////////////

var rgb = [];
for (var i = 0; i < 25000; i++) {
    var color = Math.floor(Math.random() * 16777215).toString(16);
    rgb.push("#" + color);
}

export const pieChartType = 'pie';
export const pieChartColors: any[] = [{ backgroundColor: rgb }];
export const pieChartOptions: any = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false
};
///////////////////// end Pie chart ////////////////