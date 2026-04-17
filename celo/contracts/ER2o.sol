// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ER2o
 * @notice StackAds utility token on Celo.
 *         Used for on-chain ad campaign payments, publisher payouts,
 *         and protocol governance.
 *
 * Features:
 *  - ERC20 standard (transfer, approve, allowance)
 *  - Burnable: token holders can burn their own tokens
 *  - Permit: gasless approvals via EIP-2612 signatures
 *  - Ownable: owner can mint new tokens up to MAX_SUPPLY
 *  - Capped supply: 1,000,000,000 ER2o
 */
contract ER2o is ERC20, ERC20Burnable, ERC20Permit, Ownable {
    /// @notice Hard cap on total token supply
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18; // 1 billion

    /// @notice Emitted when new tokens are minted
    event Minted(address indexed to, uint256 amount);

    /// @notice Emitted when tokens are burned via the owner burn function
    event BurnedByOwner(address indexed from, uint256 amount);

    /**
     * @param initialOwner  Address that receives ownership and the initial supply
     * @param initialSupply Amount to mint at deployment (in whole tokens, not wei)
     */
    constructor(
        address initialOwner,
        uint256 initialSupply
    )
        ERC20("ER2o", "ER2O")
        ERC20Permit("ER2o")
        Ownable(initialOwner)
    {
        require(initialOwner != address(0), "ER2o: zero address");
        require(
            initialSupply * 10 ** decimals() <= MAX_SUPPLY,
            "ER2o: exceeds max supply"
        );

        if (initialSupply > 0) {
            _mint(initialOwner, initialSupply * 10 ** decimals());
            emit Minted(initialOwner, initialSupply * 10 ** decimals());
        }
    }

    /**
     * @notice Mint new tokens. Only callable by owner.
     * @param to     Recipient address
     * @param amount Amount in wei (use 10**18 per token)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "ER2o: mint to zero address");
        require(
            totalSupply() + amount <= MAX_SUPPLY,
            "ER2o: exceeds max supply"
        );
        _mint(to, amount);
        emit Minted(to, amount);
    }

    /**
     * @notice Owner can burn tokens from any address that has approved this contract.
     *         Useful for protocol-level token reclamation.
     * @param from   Address to burn from
     * @param amount Amount in wei
     */
    function burnFrom(address from, uint256 amount) public override {
        super.burnFrom(from, amount);
        emit BurnedByOwner(from, amount);
    }

    /**
     * @notice Returns token decimals (standard 18)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
