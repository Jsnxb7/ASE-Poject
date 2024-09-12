from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/announcement')
def announcement():
    return render_template('Announcement.html')

@app.route('/assignment')
def assignment():
    return render_template('Assignment.html')

@app.route('/lectures')
def lectures():
    return render_template('Lectures.html')

@app.route('/milestones')
def milestones():
    return render_template('Milestone.html')

@app.route('/research')
def research():
    return render_template('Research.html')

if __name__ == '__main__':
    app.run(debug=True)
