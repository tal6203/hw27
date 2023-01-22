

function run_me() {
  fetch("/test")
    .then((response) => response.json())
    .then((json) => {
      console.log(json.test);
      var tb = "";
      json.test.forEach((e) => {
        tb += `<tr><td>${e.id}</td>
                <td>${e.updateat}</td>
                <td>${e.name}</td>
                <td>${e.date}</td>
                <td>${e.courseid}</td></tr>`;
      });
      document.getElementById("data").innerHTML = tb;
    });
}
function getBYId() {
  fetch(`test/${document.getElementById("txt_id").value}`)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      var tb = "";
      tb = `<tr><td>${json.id}</td>
            <td>${json.updateat}</td>
            <td>${json.name}</td>
            <td>${json.date}</td>
            <td>${json.courseid}</td></tr>`;
      document.getElementById("data").innerHTML = tb;
    });
}


function fire_add() {
  let date = new Date();
  fetch("/test", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    // take from inputs
    body: JSON.stringify({
      updateat: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${new Date().toLocaleTimeString()}`,
      name: document.getElementById("txt_name").value,
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${new Date().toLocaleTimeString()}`,
      courseid: parseFloat(document.getElementById("txt_courseid").value),
    }),
  }).then((response) => run_me());
}

function fire_update() {
  let date = new Date();
  fetch(`/test/${document.getElementById("txt_id_update").value}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      updateat: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${new Date().toLocaleTimeString()}`,
      name: document.getElementById("txt_name_update").value,
      courseid: parseFloat(
        document.getElementById("txt_courseid_update").value
      ),
    }),
  }).then((response) => {
    console.log(response);
    run_me();
  });
}
function fire_delete() {
  fetch(`/test/${document.getElementById("txt_id_del").value}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  }).then((response) => {
    run_me();
  });
}