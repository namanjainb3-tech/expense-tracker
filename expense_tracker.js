/*
 *                                                          Project: Expense Tracker
 *                                                              Version: v1.1
 *                                                              Author: Naman
 *
 *                                                               Description:
 *                                             A responsive expense tracking application with
 *                                              category-wise spending analysis, budget & balance
 *                                             management, persistent local storage, and keyboard
 *                                                   shortcuts for faster interaction.
 */

//================================================================================
//                            DOM Elments

const settings=document.querySelector("#settings");
const nav_section=document.querySelector(".nav-section");
const nav_options=document.querySelector(".nav-bar");
const body=document.querySelector("body");
const mode=document.querySelector(".mode");
const Add_expense_btn=document.querySelector("#add-expense");
const expenseDetails=document.querySelector(".New-expense");
const expenseName=document.querySelector(".Expense-name");
const expenseAmount=document.querySelector(".Expense-amount");
const expenseClasses=document.querySelector(".Expense-classes");
const saveBtn=document.querySelector("#Save-expense");
const resetExpenses=document.querySelector(".reset");
const emptyMsg=document.querySelector(".empty-msg");
const expenseListContainer=document.querySelector(".expense-list-container");
const expenseList=document.querySelector(".expense-list");
const foodExpenseTracker=document.querySelector(".food-expense");
const travelExpenseTracker=document.querySelector(".travel-expense");
const billsExpenseTracker=document.querySelector(".bills-expense");
const CategoryWiseExpense=document.querySelector(".CategoryWise-expenses");
const totalExpenseTracker=document.querySelector(".Total-expenses");
const TotalExpenseSection=document.querySelector(".totalExpense-section");
const setBudgetbtn=document.querySelector(".set-budget");
const viewBudgetbtn=document.querySelector(".view-budget");
const balanceTracker=document.querySelector(".balance");
const resetBudget=document.querySelector(".resetBudget");
const clearData=document.querySelector(".clear");

//================================================================================

//================================================================================
//                          Save to Local Storage section

function saveToLocal() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

//================================================================================

//===============================================================================
//                                 Settings-section

settings.addEventListener("click",()=>{
    nav_section.classList.toggle("hide");
})

document.addEventListener("click", (e) => {
    if (!nav_section.contains(e.target) && !settings.contains(e.target)){
        nav_section.classList.add("hide");
    }
});

mode.addEventListener("click",()=>{    //change-mode-button
    body.classList.toggle("day");
    body.classList.toggle("night");
    nav_section.classList.add("hide");
})

resetExpenses.addEventListener("click",()=>{          //reset-expenses-button
    const confirmation=confirm("Are you sure you want to reset the expenses. This cannot be undone."); 
    if(confirmation){
        expenses=[];
        saveToLocal();
        renderList();
    }
    nav_section.classList.add("hide");
})

function setBudget(){
    const input=prompt("Enter your monthly budget (₹):");
    if(input===null) return;

    const budgetValue=Number(input);

    if (budgetValue <= 0 || isNaN(budgetValue)) {
        alert("Please enter a valid budget amount.");
        return;
    }

    budget = budgetValue;
    localStorage.setItem("budget", budget);

    alert(`Budget set to ₹${budget}`);
    nav_section.classList.add("hide");

    TotalExpenseSection.classList.add("with-budget");
    balanceTracker.classList.remove("hide");
    renderList();
}

setBudgetbtn.addEventListener("click",setBudget);  //set-budget-button

viewBudgetbtn.addEventListener("click",()=>{        //view-budget-button
    alert(`Your monthly budget is: ${budget}`);
    nav_section.classList.add("hide");
})

resetBudget.addEventListener("click",()=>{         //reset-budget-button
    budget=null;
    localStorage.removeItem("budget");
    alert("budget reset successfully")
    nav_section.classList.add("hide");
    renderList();
})

clearData.addEventListener("click",()=>{        //clear-all-data-button
    const confirmation=confirm("Are you sure you want to clear all the data. This cannot be undone.");
    if(confirmation){
        budget=null;
        localStorage.removeItem("budget");
        expenses=[];
        saveToLocal();
        renderList();
    }
    nav_section.classList.add("hide");
})

//=======================================================================================

//=======================================================================================
//                              Add-Expense-Section

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];    //local storage retrieval (single source of truth)
let budget = localStorage.getItem("budget") !== null? Number(localStorage.getItem("budget")): null;
renderList();
saveBtn.disabled=true;
Add_expense_btn.addEventListener("click",()=>{
    expenseDetails.classList.toggle("hide");
})

function addExpense(){
    expenses.push({
        id:Date.now(),
        name:expenseName.value.trim(),
        amount:Number(expenseAmount.value),
        category:expenseClasses.value,})
    
    saveToLocal();
    renderList();
    
    alert("Expense added successfully");
    expenseName.value="";
    expenseAmount.value="";
    expenseClasses.value="Category";
    saveBtn.disabled=true;
    expenseDetails.classList.add("hide");
    
}

saveBtn.addEventListener("click",addExpense);

//=========================================================================================

//=========================================================================================
//                               Preventing-empty-input

function validateInputs() {
    const nameValid = expenseName.value.trim() !== "";
    const amountValid = expenseAmount.value > 0;
    const categoryValid = expenseClasses.value !== "Category";

    saveBtn.disabled = !(nameValid && amountValid && categoryValid);
}

expenseName.addEventListener("input", validateInputs);
expenseAmount.addEventListener("input", validateInputs);
expenseClasses.addEventListener("change", validateInputs);

//=========================================================================================

//=========================================================================================
//                                    Rendering UI list

function renderList(){
    let foodExpense=0;
    let travelExpense=0;
    let billsExpense=0;
    
    expenseList.innerHTML="";
    if(expenses.length===0){
        emptyMsg.classList.remove("hide");
        CategoryWiseExpense.classList.add("hide");
        TotalExpenseSection.classList.add("hide");
        return;
    }
    emptyMsg.classList.add("hide");

    expenses.forEach(expense=>{
        const li=document.createElement("li");
        li.classList.add("expense-item");

        li.innerHTML=`
        <span>${expense.name}</span>
        <span>₹${expense.amount}</span>
        <span>${expense.category}</span>
        <button data-id=${expense.id}>❌</button>`;

        expenseList.appendChild(li);

        CategoryWiseExpense.classList.remove("hide");
        TotalExpenseSection.classList.remove("hide");


        if(expense.category==="Food"){
            foodExpense+=expense.amount;}
        else if(expense.category==="Travel"){
            travelExpense+=expense.amount;}
        else if(expense.category==="Bills"){
            billsExpense+=expense.amount;}
        })
        
        foodExpenseTracker.innerText=`Food: ₹${foodExpense}`;
        travelExpenseTracker.innerText=`Travel: ₹${travelExpense}`;
        billsExpenseTracker.innerText=`Bills: ₹${billsExpense}`;
        
        const totalSpent = foodExpense + travelExpense + billsExpense;
        totalExpenseTracker.innerText = `Total Spent: ₹${totalSpent}`;

        const balance=budget-totalSpent;
        if (budget !== null) {
            balanceTracker.classList.remove("hide");
            TotalExpenseSection.classList.add("with-budget");
            balanceTracker.innerText = `Balance: ₹${budget - totalSpent}`; 
            if (balance < 0) {
                balanceTracker.style.color = "red";}
            else if (balance <= budget * 0.2) {
                balanceTracker.style.color = "orange";} 
            else {
                balanceTracker.style.color = "lightgreen";
            }}
            
        else {
            balanceTracker.classList.add("hide");}
}

//================================================================================

//================================================================================
//                                      Deleting Expenses Section

expenseList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        const idToDelete = Number(e.target.dataset.id);
        expenses = expenses.filter(exp => exp.id !== idToDelete);

        saveToLocal();
        renderList();
    }
});

//================================================================================

//================================================================================
//                                      Flexible UI

document.addEventListener("keydown",(e)=>{
    if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) 
        return;
    if(e.key==="Enter" && e.ctrlKey){
        e.preventDefault();
        expenseDetails.classList.remove("hide");
        expenseName.focus();
        return;
    }
    if(e.key==="Escape"){
        expenseDetails.classList.add("hide");
    }
    if(e.key.toLowerCase()==='b' && e.ctrlKey){
        setBudget();
        return;
    }
})

expenseDetails.addEventListener("keydown",(e)=>{
    if(e.key==="Enter" && !saveBtn.disabled){
        e.preventDefault();
        addExpense();}
})

//==================================================================================


