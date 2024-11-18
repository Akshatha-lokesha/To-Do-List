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
        span.innerHTML='\u00d7'
        li.appendChild(span)

        const ebtn=document.createElement('button')
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