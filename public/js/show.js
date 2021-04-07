const toggleSelfReviewEdit = () => {
    const selfReviewEdit = document.getElementById('self-review-edit')
    const selfReviewPosted = document.getElementById('self-review-posted')

    selfReviewEdit.style.display = selfReviewEdit.style.display === 'none' ? 'block' : 'none' 
    selfReviewPosted.style.display = selfReviewPosted.style.display === 'none' ? 'flex' : 'none' 

}