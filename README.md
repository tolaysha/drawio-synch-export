```markdown
# drawio-synch-export

## Description
`drawio-synch-export` is an application for automatically converting `.drawio` files to `['svg', 'png', 'pdf', 'jpeg'];` whenever changes are detected. It monitors a specified directory, tracks file changes, and performs the conversion.

---

## Requirements
To run the application, the following programs and dependencies are required:
1. **Node.js** (version 16 or higher):
   - Required for running the application.
3. **Draw.io CLI**:
   - Installed locally or in the container for performing the conversion.

---

## Installation
1. Ensure **Node.js** is installed:
   If not installed, download and install it from the [official Node.js website](https://nodejs.org/).

2. Clone the repository:
    git clone https://github.com/your-repo/drawio-synch-export.git
    cd drawio-synch-export


## Usage
The application accepts three optional arguments:
1. **`watchDirectory`**:
   - Directory to monitor for `.drawio` files.
   - Default: The directory where the application is executed (`process.cwd()`).
2. **`outputFormat`**:
   - Format for conversion (`svg`, `png`, `pdf`, `jpeg`).
   - Default: `svg`.
3. **`drawioCliPath`**:
   - Path to the Draw.io CLI executable.
   - Default: 

draw.io

.

### Example Run
#### Locally:
1. **With default arguments**:
   ```bash
   node main.js
   ```
   - Monitors the current directory.
   - Converts `.drawio` files to `.svg`.

2. **With custom arguments**:
   ```bash
   node main.js /path/to/watch-directory png /custom/path/to/drawio
   ```
   - Monitors `/path/to/watch-directory`.
   - Converts `.drawio` files to `.png`.
   - Uses Draw.io CLI located at `/custom/path/to/drawio`.

---

## Usage with Docker
1. Ensure Docker is installed:
   If not installed, download and install it from the [official Docker website](https://www.docker.com/).

2. Build the Docker image:
   ```bash
   docker build -t drawio-synch-export .
   ```

3. Run the container:
   ```bash
   docker run --rm -it \
   -v $(pwd):/app \
   -v $(pwd)/data-for-example:/app/data-for-example \
   drawio-synch-export
   ```


## Notes
- Ensure `Draw.io CLI` is installed and accessible at the specified path.
- If using a container, ensure `Xvfb` is properly configured for `Draw.io CLI`.
- For automatic application restarts on file changes, use `nodemon`:
  ```bash
  npm install --save-dev nodemon
  nodemon main.js ./data-for-example svg
  ```

---

## License
This application is distributed under the MIT license.
```