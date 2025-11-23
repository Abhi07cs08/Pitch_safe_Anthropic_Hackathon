// backend/config/dependencies.js
const GameDataAccessSQL = require('../frameworks-drivers/data/implementations/gameDataAccessSQL');
const PlayerDataAccessPG = require('../frameworks-drivers/data/implementations/playerDataAccessPG');
const UserDataAccessSQL = require('../frameworks-drivers/data/implementations/userDataAccessSQL');
const MLDataAccessHTTP = require('../frameworks-drivers/data/implementations/mlDataAccessHTTP');
const ClaudeDataAccessHTTP = require('../frameworks-drivers/data/implementations/claudeDataAccessHTTP');

// Game Use Cases
const AddGameRecordUseCase = require('../use-cases/game/AddGameRecordUseCase');
const GetPlayerGamesUseCase = require('../use-cases/game/GetPlayerGamesUseCase');
const UpdateGameRecordUseCase = require('../use-cases/game/UpdateGameRecordUseCase');
const DeleteGameRecordUseCase = require('../use-cases/game/DeleteGameRecordUseCase');

// Player Use Cases
const GetAllPlayersUseCase = require('../use-cases/player/GetAllPlayersUseCase');
const GetPlayerInfoUseCase = require('../use-cases/player/GetPlayerInfoUseCase');
const GetPlayersByCoachUseCase = require('../use-cases/player/GetPlayersByCoachUseCase');

// Auth Use Cases
const LoginUseCase = require('../use-cases/auth/LoginUseCase');
const SignupUseCase = require('../use-cases/auth/SignupUseCase');

// ML Use Cases
const GetInjuryRiskUseCase = require('../use-cases/ml/GetInjuryRiskUseCase');
const GetAllPredictionsUseCase = require('../use-cases/ml/GetAllPredictionsUseCase');

// Claude Use Cases
const GenerateCoachAnalysisUseCase = require('../use-cases/claude/GenerateCoachAnalysisUseCase');

// Controllers
const GameController = require('../interface-adapters/controllers/GameController');
const PlayerController = require('../interface-adapters/controllers/PlayerController');
const AuthController = require('../interface-adapters/controllers/AuthController');
const MLController = require('../interface-adapters/controllers/MLController');
const ClaudeController = require('../interface-adapters/controllers/ClaudeController');

// Presenters
const GamePresenter = require('../interface-adapters/presenters/GamePresenter');
const PlayerPresenter = require('../interface-adapters/presenters/PlayerPresenter');
const AuthPresenter = require('../interface-adapters/presenters/AuthPresenter');
const MLPresenter = require('../interface-adapters/presenters/MLPresenter');
const ClaudePresenter = require('../interface-adapters/presenters/ClaudePresenter');

// View Models
const HttpViewModel = require('../interface-adapters/view-models/HttpViewModel');

function configureDependencies() {
  // Data Access implementations
  const gameDAO = new GameDataAccessSQL();
  const playerDAO = new PlayerDataAccessPG();
  const userDAO = new UserDataAccessSQL();
  const mlDAO = new MLDataAccessHTTP();
  const claudeDAO = new ClaudeDataAccessHTTP();

  // View Models
  const gameViewModel = new HttpViewModel();
  const playerViewModel = new HttpViewModel();
  const authViewModel = new HttpViewModel();
  const mlViewModel = new HttpViewModel();
  const claudeViewModel = new HttpViewModel();

  // Presenters
  const gamePresenter = new GamePresenter(gameViewModel);
  const playerPresenter = new PlayerPresenter(playerViewModel);
  const authPresenter = new AuthPresenter(authViewModel);
  const mlPresenter = new MLPresenter(mlViewModel);
  const claudePresenter = new ClaudePresenter(claudeViewModel);

  // Use Cases
  const addGameRecordUseCase = new AddGameRecordUseCase(gameDAO, gamePresenter);
  const getPlayerGamesUseCase = new GetPlayerGamesUseCase(gameDAO, gamePresenter);
  const updateGameRecordUseCase = new UpdateGameRecordUseCase(gameDAO, gamePresenter);
  const deleteGameRecordUseCase = new DeleteGameRecordUseCase(gameDAO, gamePresenter);
  
  const getAllPlayersUseCase = new GetAllPlayersUseCase(playerDAO, playerPresenter);
  const getPlayerInfoUseCase = new GetPlayerInfoUseCase(playerDAO, playerPresenter);
  const getPlayersByCoachUseCase = new GetPlayersByCoachUseCase(playerDAO, playerPresenter);
  
  const loginUseCase = new LoginUseCase(userDAO, authPresenter);
  const signupUseCase = new SignupUseCase(userDAO, authPresenter);
  
  const getInjuryRiskUseCase = new GetInjuryRiskUseCase(mlDAO, mlPresenter);
  const getAllPredictionsUseCase = new GetAllPredictionsUseCase(mlDAO, mlPresenter);
  
  const generateCoachAnalysisUseCase = new GenerateCoachAnalysisUseCase(claudeDAO, gameDAO, claudePresenter);

  // Controllers
  const gameController = new GameController(
    addGameRecordUseCase,
    getPlayerGamesUseCase,
    updateGameRecordUseCase,
    deleteGameRecordUseCase,
    gameViewModel
  );
  
  const playerController = new PlayerController(
    getAllPlayersUseCase,
    getPlayerInfoUseCase,
    getPlayersByCoachUseCase,
    playerViewModel
  );
  
  const authController = new AuthController(
    loginUseCase,
    signupUseCase,
    authViewModel
  );

  const mlController = new MLController(
    getInjuryRiskUseCase,
    getAllPredictionsUseCase,
    mlViewModel
  );

  const claudeController = new ClaudeController(
    generateCoachAnalysisUseCase,
    claudeViewModel
  );

  return {
    gameController,
    playerController,
    authController,
    mlController,
    claudeController
  };
}

module.exports = configureDependencies;