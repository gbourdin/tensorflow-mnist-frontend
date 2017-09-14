class Print {
    constructor() {
        this.canvas = document.getElementById('main');
        this.input = document.getElementById('input');
        this.canvas.width = 449; // 16 * 28 + 1
        this.canvas.height = 449; // 16 * 28 + 1
        this.ctx = this.canvas.getContext('2d');
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.initialize();
    }

    initialize() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, 449, 449);
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(0, 0, 449, 449);
        this.ctx.lineWidth = 0.05;
        for (let i = 0; i < 27; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo((i + 1) * 16, 0);
            this.ctx.lineTo((i + 1) * 16, 449);
            this.ctx.closePath();
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, (i + 1) * 16);
            this.ctx.lineTo(449, (i + 1) * 16);
            this.ctx.closePath();
            this.ctx.stroke();
        }
        this.drawInput();
        // $('#output td').text('').removeClass('success');

    }

    onMouseDown(e) {
        this.canvas.style.cursor = 'default';
        this.drawing = true;
        this.prev = this.getPosition(e.clientX, e.clientY);
    }

    onMouseUp() {
        this.drawing = false;
        this.drawInput();
    }

    onMouseMove(e) {
        if (this.drawing) {
            let curr = this.getPosition(e.clientX, e.clientY);
            this.ctx.lineWidth = 16;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(this.prev.x, this.prev.y);
            this.ctx.lineTo(curr.x, curr.y);
            this.ctx.stroke();
            this.ctx.closePath();
            this.prev = curr;
        }
    }

    getPosition(clientX, clientY) {
        let rect = this.canvas.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    drawInput() {
        let ctx = this.input.getContext('2d');
        let img = new Image();
        img.onload = () => {
            let inputs = [];
            let small = document.createElement('canvas').getContext('2d');
            small.drawImage(img, 0, 0, img.width, img.height, 0, 0, 28, 28);
            let data = small.getImageData(0, 0, 28, 28).data;
            for (let i = 0; i < 28; i++) {
                for (let j = 0; j < 28; j++) {
                    let n = 4 * (i * 28 + j);
                    inputs[i * 28 + j] = (data[n + 0] + data[n + 1] + data[n + 2]) / 3;
                    ctx.fillStyle = 'rgb(' + [data[n + 0], data[n + 1], data[n + 2]].join(',') + ')';
                    ctx.fillRect(j * 5, i * 5, 5, 5);
                }
            }
            if (Math.min(...inputs) === 255) {
                return;
            }

            console.log(inputs);

            //const response = api.get('/status');
            fetch('/api/mnist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputs)
            }).then(response => {
                console.log('response', response);
                return response.text()
            }).then(body => {
                const data = JSON.parse(body);
                console.log('data', data);
                for (let i = 0; i < 2; i++) {
                    let max = 0;
                    let max_index = 0;
                    for (let j = 0; j < 10; j++) {
                        let value = Math.round(data.results[i][j] * 1000);
                        if (value > max) {
                            max = value;
                            max_index = j;
                        }
                        let digits = String(value).length;
                        for (let k = 0; k < 3 - digits; k++) {
                            value = '0' + value;
                        }
                        let text = '0.' + value;
                        if (value > 999) {
                            text = '1.000';
                        }
                        let row = document.querySelectorAll('#output tr')[j + 1];
                        let cell = row.getElementsByTagName('td')[i];
                        cell.textContent = text;
                    }
                    for (let j = 0; j < 10; j++) {
                        let row = document.querySelectorAll('#output tr')[j + 1];
                        let cell = row.getElementsByTagName('td')[i];
                        if (j === max_index) {
                            cell.classList.add('success');
                        } else {
                            cell.classList.remove('success');
                        }
                    }
                }
            });
        };
        img.src = this.canvas.toDataURL();
    }
}

export default Print;
