// Lấy các phần tử DOM
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');
const resultBoxes = document.querySelectorAll('.result-box img');
const resultCounts = document.querySelectorAll('.result-box span');
const betBoxes = document.querySelectorAll('.bet-box');
const betCounts = document.querySelectorAll('.bet-box span');

// Danh sách các hình ảnh
const images = ['tom', 'cua', 'bau', 'ca', 'ga', 'huou'];

// Biến trạng thái
let isSpinning = false;
let totalBets = 0;

// Hàm random hình ảnh
function getRandomImage() {
    return images[Math.floor(Math.random() * images.length)];
}

// Hàm quay kết quả với hiệu ứng setInterval
function spinResults(callback) {
    const intervals = [];
    const finalResults = [];

    resultBoxes.forEach((box, index) => {
        let counter = 0;

        const interval = setInterval(() => {
            box.src = `image/${getRandomImage()}.png`;
            counter++;

            if (counter >= 100) {
                clearInterval(interval);
                const finalImage = getRandomImage();
                box.src = `image/${finalImage}.png`;
                finalResults.push(finalImage);

                if (finalResults.length === resultBoxes.length) {
                    callback(finalResults); // Gọi callback khi hoàn thành quay
                }
            }
        }, 20); // Tốc độ thay đổi ảnh

        intervals.push(interval);
    });
}

// Xử lý nút Quay
spinBtn.addEventListener('click', () => {
    if (isSpinning) return; // Ngăn nhấn nhiều lần khi đang quay

    isSpinning = true;
    spinResults((finalResults) => {
        isSpinning = false;
        updateResultCounts(finalResults);
        compareResults(finalResults);
    });
});

// Cập nhật kết quả hiển thị
function updateResultCounts(results) {
    const counts = { tom: 0, cua: 0, bau: 0, ca: 0, ga: 0, huou: 0 };
    results.forEach((result) => counts[result]++);
    resultCounts.forEach((count, index) => {
        const imageName = images[index];
        count.textContent = counts[imageName];
    });
}

// Xử lý đặt cược
betBoxes.forEach((box, index) => {
    box.addEventListener('click', () => {
        if (isSpinning || totalBets >= 3) return; // Không đặt được khi đang quay hoặc vượt giới hạn

        const betCount = parseInt(betCounts[index].textContent);
        if (betCount < 3) {
            betCounts[index].textContent = betCount + 1;
            totalBets++;
        }
    });
});

// Xử lý đặt lại
resetBtn.addEventListener('click', () => {
    if (isSpinning) return; // Không reset khi đang quay

    betCounts.forEach((count) => (count.textContent = 0));
    totalBets = 0;
});

// So sánh kết quả với cược
function compareResults(results) {
    let correctGuesses = 0;

    results.forEach((result) => {
        betBoxes.forEach((box, index) => {
            const imageName = images[index];
            const betCount = parseInt(betCounts[index].textContent);

            if (result === imageName && betCount > 0) {
                correctGuesses++;
            }
        });
    });

    if (correctGuesses > 0) {
        alert(`Bạn đã đoán đúng với ${correctGuesses} hình!`);
    } else {
        alert(`Bạn đã đoán sai với kết quả: ${results.join(', ')}`);
    }
}
