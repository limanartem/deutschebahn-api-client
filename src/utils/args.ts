/**
 * Retrieves command line arguments and returns them as an object.
 * @returns {Object} An object containing the command line arguments.
 */
const getArgs = () => {
  const args = process.argv.slice(2);
  const argsObj = args.reduce((acc: any, arg) => {
    const [key, value] = arg.split('=');
    acc[key] = value;
    return acc;
  }, {});

  return argsObj;
};

export default getArgs;
