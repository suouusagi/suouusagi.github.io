window.onload = function() {
    // Assuming your CSV file is named data.csv
    var csvFilePath = 'courses.csv';

    function parseCSV(data) {
        const rows = data.trim().split('\n');
        const headers = rows.shift().split('|');
      
        return rows.map(row => {
          const values = row.split('|');
          const obj = {};
          for (let i = 0; i < headers.length; i++) {
            obj[headers[i].trim()] = values[i].trim();
          }
          return obj;
        });
      }

      const periods = [
        "Mon.1", "Mon.2", "Mon.3", "Mon.4", "Mon.5", "Mon.6", "Mon.7",
        "Tues.1", "Tues.2", "Tues.3", "Tues.4", "Tues.5", "Tues.6", "Tues.7",
        "Wed.1", "Wed.2", "Wed.3", "Wed.4", "Wed.5", "Wed.6", "Wed.7",
        "Thur.1", "Thur.2", "Thur.3", "Thur.4", "Thur.5", "Thur.6", "Thur.7",
        "Fri.1", "Fri.2", "Fri.3", "Fri.4", "Fri.5", "Fri.6", "Fri.7", "othersOn demand", "othersothers"
    ];

      function p_data_to_t_data (data){
        var t_list = [];
        periods.forEach(period => {
          t_table = {}
          f = filterObjectsByProperty(data, "Period", period);
          if (f.length == 0) {
          }
          else {
            t_table[period] = f;
            t_list.push(t_table);
        }})
        return t_list
      }


      function splitByProperty(array, property) {
        return array.reduce((acc, obj) => {
          const value = obj[property];
          acc[value] = acc[value] || [];
          acc[value].push(obj);
          return acc;
        }, {});
      }

      function filterObjectsByProperty(objects, textValue1, textValue2) {
        const result = [];
      
        for (const obj of objects) {
          const propertyValue = obj[textValue1];
      
          if (propertyValue && propertyValue.includes(textValue2)) {
            result.push(obj);
          }
        }
      
        return result;
      }

      function createcol(tr, value, id) {
        var td = document.createElement('td');
        td.textContent = value;
        td.id = id;
        tr.appendChild(td);
        return tr
      }

      function createcol_b(tr,value, id) {
        var td = document.createElement('td');
        var values = value.slice(2, -2).split("', '");
        values.forEach(value => {
        if (values.length === 1) {
            td.textContent = value;
            td.id = id;
            tr.appendChild(td); 
        } 
        else{
        td.id = id;
        value = document.createTextNode(value);
        td.appendChild(value);
        td.appendChild(document.createElement('br'));
        tr.appendChild(td);
                         }})
        return tr
      }

      function make_table(database){
        var table = document.getElementById('csvTable');
        var tbody = document.createElement('tbody');
        tbody.id = "csvTable_body"

        database.forEach(course => {
          tag = Object.keys(course)[0];
          course[tag].forEach((s_course, index) => {  
            if (index == 0) {
              var tr = document.createElement('tr');
              var time = document.createElement('td');
      
              time.textContent = tag;
              time.rowSpan = course[tag].length;
              time.id = "time_p";
        
              tr.appendChild(time);
              createcol(tr,s_course.Code, "code")
    
              const link = document.createElement('a');
              link.textContent = s_course.Title;
              link.href = s_course.c_id;
              link.target="_blank"
              var td = document.createElement('td');
              td.appendChild(link);
              tr.appendChild(td);
    
              createcol(tr,s_course.Instructor, "instructor")
              createcol(tr,s_course.Term, "term")
              createcol_b(tr,s_course.Period, "period")
              createcol_b(tr,s_course.Classroom, "classroom")
              
            }
            else {
              var tr = document.createElement('tr');
              createcol(tr,s_course.Code, "code")
    
              const link = document.createElement('a');
              link.textContent = s_course.Title;
              link.href = s_course.c_id;
              link.target="_blank"
              var td = document.createElement('td');
              td.appendChild(link);
              tr.appendChild(td);
    
              createcol(tr,s_course.Instructor, "instructor")
              createcol(tr,s_course.Term, "term")
              createcol_b(tr,s_course.Period, "period")
              createcol_b(tr,s_course.Classroom, "classroom")
            }
            
    
            tbody.appendChild(tr);
          })
        })
        table.appendChild(tbody);
      }

      function filterTerm(query, data){
        result = []
        if (query === "spring"){
          data.forEach(row => {
            if (row.Term === "spring semester" || row.Term === "spring quarter" || row.Term === "summer quarter"){
              result.push(row);
            }
        })
}
        else if (query === "fall"){
          data.forEach(row => {
            if (row.Term === "fall semester" || row.Term === "fall quarter" || row.Term === "winter quarter"){
              result.push(row);
            }
        })
        }
        return result;
      }
    
  fetch(csvFilePath)
  .then(response => response.text())
  .then(csvData => {
    // Process the CSV data
    const parsedData = parseCSV(csvData);

    // Process to data seperated by time
    t_list = p_data_to_t_data(parsedData);

    //make table
    make_table(t_list);

    const s_button = document.getElementById('spring-semester-btn');
    const f_button = document.getElementById('fall-semester-btn');
    const a_button = document.getElementById('all-btn');

    s_button.addEventListener('click', function() {
        s_data = filterTerm("spring",parsedData)
        s_data = p_data_to_t_data(s_data)

        table = document.getElementById('csvTable_body');
        table.remove();

        make_table(s_data);
      });

    f_button.addEventListener('click', function() {
        f_data = filterTerm("fall",parsedData)
        f_data = p_data_to_t_data(f_data)

        table = document.getElementById('csvTable_body');
        table.remove();

        make_table(f_data);
      });

    a_button.addEventListener('click', function(){
      table = document.getElementById('csvTable_body');
      table.remove();
      make_table(t_list);
    });




  //   parsedData.forEach(course => {
  //       var tr = document.createElement('tr');
  //       createcol(tr,course.Year)
  //       createcol(tr,course.Code)

  //       const link = document.createElement('a');
  //       link.textContent = course.Title;
  //       link.href = course.c_id;
  //       link.target="_blank"
  //       var td = document.createElement('td');
  //       td.appendChild(link);
  //       tr.appendChild(td);

  //       createcol(tr,course.Instructor)
  //       createcol(tr,course.Term)
  //       createcol_b(tr,course.Period)
  //       createcol_b(tr,course.Classroom)

  //       table.appendChild(tr);


})
  };

