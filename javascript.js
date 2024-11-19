const ip=document.getElementById("ipBox")
const lis=document.getElementById("listContainer")

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addTask(){
    if(ip.value===""){
        alert("Please add one task.")
    }else{
        const li=document.createElement('li')
        li.innerHTML=ip.value
        lis.appendChild(li)

        const span=document.createElement('span')
        span.className="cross-btn"
        span.innerHTML='\u00d7'
        li.appendChild(span)

        const ebtn=document.createElement('button')
        ebtn.className="edit-btn"
        ebtn.textContent="Edit"
        li.appendChild(ebtn)
    }
    ip.value=""
    saveData()
}

function taskComplete(){
    lis.addEventListener('click',function(e){
        if(e.target.tagName==='LI'){
            e.target.classList.toggle('checked')
            saveData()
        } 
    }) 
}
taskComplete() 


function removeTask(){
   lis.addEventListener('click',function(e){
    if(e.target.tagName==='SPAN'){
        e.target.parentElement.remove()
        saveData()
    }
   })
}
removeTask()



function editTask(){
    lis.addEventListener('click',function(e){
        if(e.target.tagName==="BUTTON"&& e.target.textContent==="Edit"){
            const li=e.target.parentElement
            const cT=li.childNodes[0].nodeValue
            const edIp=document.createElement('input')
            edIp.type="text"
            edIp.value=cT.trim()
                li.childNodes[0].nodeValue=""
                e.target.textContent="Save"
                li.appendChild(edIp)
                edIp.focus()
        
                e.target.addEventListener('click',function(){
                    if(edIp.value===""){
                        alert("Task cannot be empty")
                        return
                    }
                    li.childNodes[0].nodeValue=edIp.value+" "
                    li.removeChild(edIp)
                    e.target.textContent="Edit"
                    saveData()
                    
                    
                },{once:true})
                e.target.blur();
        }
    })
}
editTask()


function saveData(){
    localStorage.setItem('data',lis.innerHTML)
}

function showData(){
    lis.innerHTML=localStorage.getItem('data')
}
showData()

const searchIP=document.getElementById('searchTask')

function search(){
    searchIP.addEventListener('input',function(){
        const search_task=searchIP.value.toLowerCase()
        const present_task=lis.getElementsByTagName('li')
        for(let i=0;i<present_task.length;i++){
            const task=present_task[i]
            const taskText=task.textContent||task.innerText
            if(taskText.toLowerCase().indexOf(search_task)>-1){
                task.style.display=""
            }else{
                 task.style.display="none"
            }

        }

    })
}
search()

const all=document.getElementById('all')
const active=document.getElementById('active')
const completed=document.getElementById('completed')

all.addEventListener('click',function(){
    filterTask('all')
})

active.addEventListener('click',function(){
    filterTask('active')
})
completed.addEventListener('click',function(){
    filterTask('completed')
})

function filterTask(status){
    const present_task=lis.getElementsByTagName('li')
    for(let i=0;i<present_task.length;i++){
        const task=present_task[i]
        if(status==='all'){
            task.style.display=""
        }else if(status==='active' && !task.classList.contains('checked')){
            task.style.display=""
        }else if(status==='completed' && task.classList.contains('checked')){
            task.style.display=""
        }else{
            task.style.display="none"
        }
    }
}


const grpBy=document.getElementById('grpbyBtn')

grpBy.addEventListener('click',function(){
    groupByTask()
})

function groupByTask(){
    const present_task=Array.from(lis.getElementsByTagName('li'))
    const active=present_task.filter(task=> !task.classList.contains('checked'))
    const complete=present_task.filter(task=> task.classList.contains('checked'))

    lis.innerHTML=""

    active.forEach(task=>lis.appendChild(task))
    complete.forEach(task=>lis.appendChild(task))
}