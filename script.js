let gameState = {
    score: 0,
    currentRound: 0,
    totalRounds: 5,
    timerEnabled: false,
    timeLeft: 30,
    timerInterval: null,
    currentEmail: null
};


const emails = [
    {
        from: "security@amaz0n.com",
        to: "you@email.com",
        subject: "URGENT: Your Account Has Been Compromised!",
        body: "Dear Customer,\n\nYour Amazon account has been compromised! Click here immediately to secure your account: http://secure-amazon-verify.net/login\n\nIf you don't act within 24 hours, your account will be permanently suspended!\n\nAmazon Security Team",
        isPhishing: true,
        explanation: "This is phishing! Red flags: suspicious domain (amaz0n.com instead of amazon.com), urgent language, generic greeting, and suspicious link to a fake domain."
    },
    {
        from: "notifications@amazon.com",
        to: "john.doe@email.com",
        subject: "Your order #123-4567890 has shipped",
        body: "Hello John,\n\nYour recent order has been shipped and is on its way! You can track your package using the tracking number: 1Z999AA1234567890\n\nExpected delivery: Tomorrow by 8 PM\n\nThank you for shopping with Amazon!\n\nThe Amazon Team",
        isPhishing: false,
        explanation: "This is legitimate! It has a proper Amazon domain, personal greeting, specific order details, and no suspicious requests for information."
    },
    {
        from: "no-reply@paypal.com",
        to: "you@email.com",
        subject: "Payment Received - $500.00",
        body: "You've received a payment of $500.00\n\nFrom: John Smith\nTo: Your Account\nTransaction ID: 4X123456789\n\nView transaction details in your PayPal account.\n\nThanks,\nPayPal",
        isPhishing: false,
        explanation: "This appears legitimate! It's from the real PayPal domain, provides transaction details, and doesn't ask for any information or urgent action."
    },
    {
        from: "billing@microsoft-support.net",
        to: "you@email.com",
        subject: "Your Windows License Has Expired",
        body: "Dear User,\n\nYour Windows license expired yesterday. To avoid losing access to your computer, please renew immediately by clicking here: http://windows-renewal.microsoft-support.net\n\nEnter your credit card information to renew for only $199.99\n\nMicrosoft Support",
        isPhishing: true,
        explanation: "This is phishing! Red flags: fake Microsoft domain (microsoft-support.net), false urgency about Windows licenses, request for credit card info, and Windows licenses don't work this way."
    },
    {
        from: "support@github.com",
        to: "developer@email.com",
        subject: "Security alert: New sign-in from Chrome on Windows",
        body: "Hi there,\n\nWe noticed a new sign-in to your GitHub account:\n\nDevice: Chrome on Windows\nLocation: San Francisco, CA\nTime: Today at 2:30 PM\n\nIf this was you, no action is needed. If not, please secure your account immediately by visiting github.com/settings/security\n\nGitHub Security",
        isPhishing: false,
        explanation: "This is legitimate! GitHub sends these security notifications. It has the correct domain, specific details, and directs you to the official GitHub website for security settings."
    },
    {
        from: "alerts@bankofamerica-security.com",
        to: "you@email.com",
        subject: "Suspicious Activity Detected",
        body: "ALERT: We detected suspicious activity on your account!\n\nSomeone tried to login from Nigeria at 3:47 AM\n\nClick here to verify your identity NOW: http://boa-verify.com/secure-login\n\nEnter your username, password, and SSN to confirm it's really you.\n\nBank of America Security",
        isPhishing: true,
        explanation: "This is phishing! Red flags: fake domain (bankofamerica-security.com), urgent language, suspicious login location designed to create panic, and request for sensitive information including SSN."
    }
];

function showGameSetup() {
    document.getElementById('titleScreen').style.display = 'none';
    document.getElementById('gameSetup').style.display = 'block';
}

function showTitleScreen() {
    document.getElementById('gameSetup').style.display = 'none';
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('tutorial').style.display = 'none';
    document.getElementById('titleScreen').style.display = 'block';
    resetGame();
}

function showTutorial() {
    document.getElementById('titleScreen').style.display = 'none';
    document.getElementById('tutorial').style.display = 'block';
}

function toggleTimer() {
    const toggle = document.getElementById('timerToggle');
    gameState.timerEnabled = !gameState.timerEnabled;
    toggle.classList.toggle('active');
}

function selectRounds(num) {
    gameState.totalRounds = num;
    document.querySelectorAll('.round-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function startGame() {
    document.getElementById('gameSetup').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('totalRounds').textContent = gameState.totalRounds;
    
    if (gameState.timerEnabled) {
        document.getElementById('timerDisplay').style.display = 'block';
    }
    
    loadNextEmail();
}

function loadNextEmail() {
    if (gameState.currentRound >= gameState.totalRounds) {
        endGame();
        return;
    }

 
    document.getElementById('feedback').style.display = 'none';
    document.querySelector('.game-buttons').style.display = 'block';


    gameState.currentEmail = emails[Math.floor(Math.random() * emails.length)];
    

    document.getElementById('emailFrom').textContent = gameState.currentEmail.from;
    document.getElementById('emailTo').textContent = gameState.currentEmail.to;
    document.getElementById('emailSubject').textContent = gameState.currentEmail.subject;
    document.getElementById('emailBody').textContent = gameState.currentEmail.body;


    if (gameState.timerEnabled) {
        gameState.timeLeft = 30;
        updateTimerDisplay();
        gameState.timerInterval = setInterval(() => {
            gameState.timeLeft--;
            updateTimerDisplay();
            if (gameState.timeLeft <= 0) {
                timeUp();
            }
        }, 1000);
    }
}

function updateTimerDisplay() {
    document.getElementById('timeLeft').textContent = gameState.timeLeft;
}

function timeUp() {
    clearInterval(gameState.timerInterval);
    showFeedback(false, "Time's up! " + gameState.currentEmail.explanation);
}

function answerPhish() {
    clearInterval(gameState.timerInterval);
    const correct = gameState.currentEmail.isPhishing;
    if (correct) gameState.score++;
    showFeedback(correct, gameState.currentEmail.explanation);
}

function answerSafe() {
    clearInterval(gameState.timerInterval);
    const correct = !gameState.currentEmail.isPhishing;
    if (correct) gameState.score++;
    showFeedback(correct, gameState.currentEmail.explanation);
}

function showFeedback(correct, explanation) {
    document.querySelector('.game-buttons').style.display = 'none';
    const feedback = document.getElementById('feedback');
    const title = document.getElementById('feedbackTitle');
    const text = document.getElementById('feedbackText');

    feedback.className = 'feedback ' + (correct ? 'correct' : 'incorrect');
    title.textContent = correct ? 'Correct!' : 'Incorrect';
    text.textContent = explanation;
    feedback.style.display = 'block';

    document.getElementById('score').textContent = gameState.score;
}

function nextEmail() {
    gameState.currentRound++;
    loadNextEmail();
}

function endGame() {
    const percentage = Math.round((gameState.score / gameState.totalRounds) * 100);
    let message = `Game Over!\n\nFinal Score: ${gameState.score}/${gameState.totalRounds} (${percentage}%)\n\n`;
    
    if (percentage >= 80) {
        message += "Excellent!";
    } else if (percentage >= 60) {
        message += "Good job!";
    } else {
        message += "Keep learning!";
    }

    alert(message);
    showTitleScreen();
}

function resetGame() {
    gameState = {
        score: 0,
        currentRound: 0,
        totalRounds: 5,
        timerEnabled: false,
        timeLeft: 30,
        timerInterval: null,
        currentEmail: null
    };
    clearInterval(gameState.timerInterval);
    document.getElementById('score').textContent = '0';
}




function showCustomEmailCreation() {
    document.getElementById('titleScreen').style.display = 'none';
    document.getElementById('customEmailSection').style.display = 'block';
}


function previewCustomEmail() {

    const from = document.getElementById('customFrom').value;
    const to = document.getElementById('customTo').value;
    const subject = document.getElementById('customSubject').value;
    const body = document.getElementById('customBody').value;
    
    if (!from || !to || !subject || !body) {
        alert('Please fill in all email fields to preview.');
        return;
    }
    
    document.getElementById('previewFrom').textContent = from;
    document.getElementById('previewTo').textContent = to;
    document.getElementById('previewSubject').textContent = subject;
    document.getElementById('previewBody').textContent = body;
    
    document.getElementById('customEmailPreview').style.display = 'block';
}


function addCustomEmail() {

    let customEmails = [];
 
    const customEmail = {
        from: from,
        to: to,
        subject: subject,
        body: body,
        isPhishing: type === 'phishing',
        explanation: explanation,
        isCustom: true
    };
    const from = document.getElementById('customFrom').value;
    const to = document.getElementById('customTo').value;
    const subject = document.getElementById('customSubject').value;
    const body = document.getElementById('customBody').value;
    const type = document.getElementById('customType').value;
    const explanation = document.getElementById('customExplanation').value;
    
   
    if (!from || !to || !subject || !body || !type || !explanation) {
        alert('Please fill in all fields before adding the email.');
        return;
    }
    
    customEmails.push(customEmail);
    emails.push(customEmail);
    alert(`Custom ${type} email added successfully! You now have ${customEmails.length} custom email(s) in the game.`);
    document.getElementById('customEmailForm').reset();
    document.getElementById('customEmailPreview').style.display = 'none';
}

function manageCustomEmails() {
    if (customEmails.length === 0) {
        alert('No custom emails created yet. Create some first!');
        return;
    }
    
    let emailList = 'Your Custom Emails:\n\n';
    customEmails.forEach((email, index) => {
        emailList += `${index + 1}. ${email.subject} (${email.isPhishing ? 'Phishing' : 'Legitimate'})\n`;
    });
    
    emailList += '\nEnter the number of an email to delete it, or click Cancel to go back:';
    
    const choice = prompt(emailList);
    
    if (choice && !isNaN(choice)) {
        const index = parseInt(choice) - 1;
        if (index >= 0 && index < customEmails.length) {
            const deletedEmail = customEmails[index];
            
       
            customEmails.splice(index, 1);
            
         
            const mainIndex = emails.findIndex(email => 
                email.isCustom && 
                email.subject === deletedEmail.subject && 
                email.from === deletedEmail.from
            );
            if (mainIndex !== -1) {
                emails.splice(mainIndex, 1);
            }
            
            alert(`Email "${deletedEmail.subject}" has been deleted.`);
        } else {
            alert('Invalid email number.');
        }
    }
}