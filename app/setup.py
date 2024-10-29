from setuptools import setup, find_packages

setup(
    name="cs271p-wordle",
    version="0.1.0",
    author="Group 42",
    description="Wordle Application",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/BenComer98/cs271p-wordle",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "Flask>=3.0",  # Ensures Flask is installed
    ],
    entry_points={
        'console_scripts': [
            'run = routes.app:run_app',
        ],
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.6",
)